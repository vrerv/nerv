/**
 * Erin Catto Sequential Impulse Solver
 * Based on GDC 2006/2014 talks by Erin Catto (Box2D creator)
 * 
 * Key techniques:
 * 1. Accumulated impulse clamping (prevents over-correction)
 * 2. Penetration slop (allows small overlap for stable contacts)
 * 3. Separate position correction (pseudo-impulse, no energy injection)
 * 4. Multiple iterations per frame (convergence)
 * 5. Body sleeping (stops processing stable bodies)
 * 6. Warm-starting (reuse previous frame's impulses)
 */

class PhysicsSolver {
    constructor(config = {}) {
        this.gravity = config.gravity || 0.015;
        this.friction = config.friction || 0.95;
        this.restitution = config.restitution || 0.2; // Low restitution = less bouncy = faster settling
        this.velocityIterations = config.velocityIterations || 6;
        this.positionIterations = config.positionIterations || 4;
        
        // Slop: allow small penetration to avoid jitter from contact breaking/remaking
        this.slop = config.slop || 0.01;
        // Baumgarte factor: how aggressively to correct position errors (0.1-0.3 typical)
        this.baumgarte = config.baumgarte || 0.2;
        // Max position correction per step (prevents large jumps)
        this.maxCorrection = config.maxCorrection || 0.2;
        
        // Sleep thresholds
        this.sleepVelocityThreshold = config.sleepVelocityThreshold || 0.008;
        this.sleepTimeThreshold = config.sleepTimeThreshold || 60; // frames before sleeping
        
        // Boundaries
        this.bounds = config.bounds || { xMin: -2.3, xMax: 2.3, zMin: -1.9, zMax: 1.9, yMin: 0.1 };
        
        // Contact cache for warm-starting
        this._contacts = new Map();
        this._prevContacts = new Map();
    }

    /**
     * Get collision radius for a body
     */
    getRadius(body) {
        return body.type === 'cat' ? 0.35 : body.type === 'duffy' ? 0.32 : body.type === 'rabbit' ? 0.30 : 0.28;
    }

    /**
     * Get inverse mass (0 = static/sleeping treated as infinite mass in collision)
     */
    getInvMass(body) {
        const mass = body.type === 'cat' ? 1.4 : body.type === 'duffy' ? 0.8 : body.type === 'rabbit' ? 1.2 : 1.0;
        return 1.0 / mass;
    }

    /**
     * Wake a body from sleep
     */
    wake(body) {
        body._sleeping = false;
        body._sleepCounter = 0;
    }

    /**
     * Wake bodies near a position
     */
    wakeNear(bodies, x, z, radius) {
        bodies.forEach(b => {
            if (b._sleeping) {
                const dx = b.x - x;
                const dz = b.z - z;
                if (dx * dx + dz * dz < radius * radius) {
                    this.wake(b);
                }
            }
        });
    }

    /**
     * Generate a stable contact ID for warm-starting
     */
    _contactId(i, j) {
        return i < j ? `${i}:${j}` : `${j}:${i}`;
    }

    /**
     * Main solver step - call once per frame
     * @param {Array} bodies - array of body objects with {x, y, z, vx, vy, vz, type, grabbed, isHeld}
     * @param {Function} onBounce - callback when bounce sound should play
     */
    step(bodies, onBounce) {
        const active = bodies.filter(b => !b.grabbed && !b.isHeld);
        const awake = active.filter(b => !b._sleeping);

        // ── 1. Integrate velocities (apply gravity) ──
        for (const b of awake) {
            b.vy -= this.gravity;
        }

        // ── 2. Detect contacts ──
        this._prevContacts = this._contacts;
        this._contacts = new Map();
        const contacts = [];

        for (let i = 0; i < active.length; i++) {
            for (let j = i + 1; j < active.length; j++) {
                const a = active[i];
                const b = active[j];
                
                // Both sleeping → skip
                if (a._sleeping && b._sleeping) continue;

                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const dz = b.z - a.z;
                const distSq = dx * dx + dy * dy + dz * dz;
                const rA = this.getRadius(a);
                const rB = this.getRadius(b);
                const minDist = rA + rB;

                if (distSq < minDist * minDist && distSq > 0.0001) {
                    const dist = Math.sqrt(distSq);
                    const nx = dx / dist;
                    const ny = dy / dist;
                    const nz = dz / dist;
                    const penetration = minDist - dist;

                    const cid = this._contactId(i, j);
                    
                    // Warm-start: retrieve accumulated impulse from previous frame
                    const prev = this._prevContacts.get(cid);
                    const accNormalImpulse = prev ? prev.accNormalImpulse : 0;

                    const contact = {
                        a, b,
                        nx, ny, nz,
                        penetration,
                        invMassA: this.getInvMass(a),
                        invMassB: this.getInvMass(b),
                        accNormalImpulse: accNormalImpulse,
                        id: cid
                    };
                    
                    contact.normalMass = 1.0 / (contact.invMassA + contact.invMassB);
                    contacts.push(contact);
                    this._contacts.set(cid, contact);

                    // Wake sleeping body if other is awake
                    if (a._sleeping && !b._sleeping) this.wake(a);
                    if (b._sleeping && !a._sleeping) this.wake(b);
                }
            }
        }

        // ── 3. Warm-start: apply previous frame's accumulated impulses ──
        for (const c of contacts) {
            if (c.accNormalImpulse > 0) {
                const p = c.accNormalImpulse;
                c.a.vx -= p * c.nx * c.invMassA;
                c.a.vy -= p * c.ny * c.invMassA;
                c.a.vz -= p * c.nz * c.invMassA;
                c.b.vx += p * c.nx * c.invMassB;
                c.b.vy += p * c.ny * c.invMassB;
                c.b.vz += p * c.nz * c.invMassB;
            }
        }

        // ── 4. Velocity solver (sequential impulses with accumulated clamping) ──
        for (let iter = 0; iter < this.velocityIterations; iter++) {
            for (const c of contacts) {
                // Relative velocity along normal
                const dvx = c.b.vx - c.a.vx;
                const dvy = c.b.vy - c.a.vy;
                const dvz = c.b.vz - c.a.vz;
                const vn = dvx * c.nx + dvy * c.ny + dvz * c.nz;

                // Compute impulse delta
                // Add restitution bias only on first iteration
                let bias = 0;
                if (iter === 0 && vn < -0.02) {
                    bias = -this.restitution * vn;
                }
                
                let impulseDelta = c.normalMass * (-vn + bias);

                // ★ KEY: Clamp accumulated impulse (not individual delta)
                // This is the critical technique from Erin Catto that prevents jitter
                const newImpulse = Math.max(c.accNormalImpulse + impulseDelta, 0);
                impulseDelta = newImpulse - c.accNormalImpulse;
                c.accNormalImpulse = newImpulse;

                // Apply impulse
                c.a.vx -= impulseDelta * c.nx * c.invMassA;
                c.a.vy -= impulseDelta * c.ny * c.invMassA;
                c.a.vz -= impulseDelta * c.nz * c.invMassA;
                c.b.vx += impulseDelta * c.nx * c.invMassB;
                c.b.vy += impulseDelta * c.ny * c.invMassB;
                c.b.vz += impulseDelta * c.nz * c.invMassB;

                // Friction (tangential) impulse
                const tvx = dvx - vn * c.nx;
                const tvy = dvy - vn * c.ny;
                const tvz = dvz - vn * c.nz;
                const tvLen = Math.sqrt(tvx * tvx + tvy * tvy + tvz * tvz);
                if (tvLen > 0.001) {
                    const tx = tvx / tvLen;
                    const ty = tvy / tvLen;
                    const tz = tvz / tvLen;
                    const vt = dvx * tx + dvy * ty + dvz * tz;
                    let frictionImpulse = c.normalMass * (-vt) * 0.3; // friction coefficient
                    // Clamp friction by Coulomb's law
                    const maxFriction = c.accNormalImpulse * 0.4;
                    frictionImpulse = Math.max(-maxFriction, Math.min(frictionImpulse, maxFriction));
                    
                    c.a.vx -= frictionImpulse * tx * c.invMassA;
                    c.a.vz -= frictionImpulse * tz * c.invMassA;
                    c.b.vx += frictionImpulse * tx * c.invMassB;
                    c.b.vz += frictionImpulse * tz * c.invMassB;
                }
            }
        }

        // ── 5. Integrate positions ──
        for (const b of awake) {
            b.x += b.vx;
            b.y += b.vy;
            b.z += b.vz;

            // Apply linear damping
            b.vx *= this.friction;
            b.vz *= this.friction;
        }

        // ── 6. Position solver (pseudo-impulse, separate from velocity) ──
        // This corrects overlap WITHOUT injecting energy into velocities
        for (let iter = 0; iter < this.positionIterations; iter++) {
            for (const c of contacts) {
                // Recalculate penetration at current positions
                const dx = c.b.x - c.a.x;
                const dy = c.b.y - c.a.y;
                const dz = c.b.z - c.a.z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                const rA = this.getRadius(c.a);
                const rB = this.getRadius(c.b);
                const separation = dist - (rA + rB); // negative = overlapping

                // Only correct if penetration exceeds slop
                const correction = Math.min(
                    Math.max(-this.baumgarte * (separation + this.slop), 0),
                    this.maxCorrection
                ) / (c.invMassA + c.invMassB);

                if (correction > 0 && dist > 0.001) {
                    const nx = dx / dist;
                    const ny = dy / dist;
                    const nz = dz / dist;

                    c.a.x -= correction * c.invMassA * nx;
                    c.a.y -= correction * c.invMassA * ny;
                    c.a.z -= correction * c.invMassA * nz;
                    c.b.x += correction * c.invMassB * nx;
                    c.b.y += correction * c.invMassB * ny;
                    c.b.z += correction * c.invMassB * nz;
                }
            }
        }

        // ── 7. Boundary constraints + sleeping ──
        const bounds = this.bounds;
        for (const b of awake) {
            // Floor
            if (b.y < bounds.yMin) {
                if (b.vy < -0.05 && onBounce) onBounce();
                b.y = bounds.yMin;
                b.vy = -b.vy * this.restitution;
                b.vx *= this.friction;
                b.vz *= this.friction;
            }

            // Walls (inelastic - no bouncing to reduce energy)
            if (b.x < bounds.xMin) { b.x = bounds.xMin; b.vx = Math.abs(b.vx) * this.restitution; }
            if (b.x > bounds.xMax) { b.x = bounds.xMax; b.vx = -Math.abs(b.vx) * this.restitution; }
            if (b.z < bounds.zMin) { b.z = bounds.zMin; b.vz = Math.abs(b.vz) * this.restitution; }
            if (b.z > bounds.zMax) { b.z = bounds.zMax; b.vz = -Math.abs(b.vz) * this.restitution; }

            // ── Sleep detection ──
            const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy + b.vz * b.vz);
            if (speed < this.sleepVelocityThreshold) {
                b._sleepCounter = (b._sleepCounter || 0) + 1;
                if (b._sleepCounter >= this.sleepTimeThreshold) {
                    b.vx = 0;
                    b.vy = 0;
                    b.vz = 0;
                    b._sleeping = true;
                }
            } else {
                b._sleepCounter = 0;
            }

            // Sync mesh
            if (b.mesh) {
                b.mesh.position.set(b.x, b.y, b.z);
            }
        }
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.PhysicsSolver = PhysicsSolver;
}
