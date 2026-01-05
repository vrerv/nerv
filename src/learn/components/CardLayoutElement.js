
import { Text, Image, Rect, Transformer } from "react-konva"
import React, { useEffect, useRef } from "react"
import useImage from 'use-image';

const ImageElement = ({ type, text, width, height, shapeRef, ...props }) => {

  console.log("text", text, width, height, props)
  let src = ''
  if (type === 'CAROUSEL') {
    src = text[0]
  } else {
    src = text
  }
  const [image, status] = useImage(src);
  const [nHeight, setNHeight] = React.useState(10)

  useEffect(() => {
    if (status === 'loaded') {
      if (height === undefined) {
        const nWidth = width
        const rw = nWidth / image.width
        const nHeight = image.height * rw
        setNHeight(nHeight)
      } else {
        setNHeight(height)
      }
    }
    if (status === 'failed') {
      console.log("FAILED", src)
    }
  }, [width, status])

  return <Image image={image} ref={shapeRef} {...props} width={width} height={nHeight} />
}

const Element = ({ type, shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef()
  const trRef = useRef()

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      if (trRef.current) {
        trRef.current.nodes([shapeRef.current])
        trRef.current.getLayer()?.batchDraw()
      }
    }
  }, [isSelected])

  const handleDragEnd = (e) => {
    onChange({
      ...shapeProps,
      x: e.target.x(),
      y: e.target.y(),
    })
  }
  const handleTransformEnd = (e) => {
    // transformer is changing scale of the node
    // and NOT its width or height
    // but in the store we have only width and height
    // to match the data better we will reset scale on transform end
    const node = shapeRef.current
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    // we will reset it back
    node.scaleX(1)
    node.scaleY(1)
    onChange({
      ...shapeProps,
      x: node.x(),
      y: node.y(),
      // set minimal value
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(node.height() * scaleY),
    })
  }

  const shapeDefaultProps = {
    onClick: onSelect,
    onTap: onSelect,
    onDragStart: onSelect,
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd
  }

  return (
    <React.Fragment>
      {type === 'BG_IMAGE' ?
        <Rect ref={shapeRef} {...shapeDefaultProps} {...shapeProps} />
        :
        type === 'IMAGE' || type === 'CAROUSEL' ?
          <ImageElement type={type} shapeRef={shapeRef} {...shapeDefaultProps} {...shapeProps} />
          :
          <Text ref={shapeRef} {...shapeDefaultProps} {...shapeProps} padding={0} lineHeight={1}
            hitFunc={(context, shape) => {
              context.beginPath()
              const style = shape.getAttr('fontStyle') || 'normal'
              const variant = shape.getAttr('fontVariant') || 'normal'
              const size = shape.getAttr('fontSize') || 12
              const family = shape.getAttr('fontFamily') || 'Arial'
              context.font = `${style} ${variant} ${size}px "${family}"`
              context.textBaseline = 'top'
              context.textAlign = shape.getAttr('align') || 'left'
              const text = shape.getAttr('text') || ''
              context.lineWidth = 10;
              context.lineJoin = 'round';
              context.fillStyle = shape.colorKey;
              context.strokeStyle = shape.colorKey;
              context.strokeText(text, 0, 0);
              context.fillText(text, 0, 0);
            }}
          />

      }
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          shouldOverdrawWholeArea={true}
          enabledAnchors={type === 'BG_IMAGE' ? ['bottom-center'] : type === 'TEXT' ? [] : ['middle-right', 'bottom-center', 'bottom-right']}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox
            }
            return newBox
          }}
        />
      )}
    </React.Fragment>
  )
}

export default Element