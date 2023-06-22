/* eslint-disable react/display-name */
import { useMemo } from 'react'
import { getMDXComponent } from 'mdx-bundler/client'
import Image from './Image'
import CustomLink from './Link'
import TOCInline from './TOCInline'
import Pre from './Pre'
//import { BlogNewsletterForm } from './NewsletterForm'


/**
 * from https://github.com/timlrx/tailwind-nextjs-starter-blog/blob/master/components/MDXComponents.js
 * @type {{a: ((function({href: *, [p: string]: *}): *)|*), pre: ((function(*): *)|*), TOCInline: ((function({toc: TocHeading[], indentDepth?: number, fromHeading?: number, toHeading?: number, asDisclosure?: boolean, exclude?: (string|string[])}): *)|*), wrapper: (function({components: *, layout: *, [p: string]: *}): *), Image: ((function({[p: string]: *}): *)|*)}}
 */
export const MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  //BlogNewsletterForm: BlogNewsletterForm,
  ///*
  wrapper: ({ components, layout, ...rest }) => {
    const Layout = require(`../layouts/${layout}`).default
    return <Layout {...rest} />
  },
  //*/
}

export const MDXLayoutRenderer = ({ layout, mdxSource, ...rest }) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])

  return <MDXLayout layout={layout} components={MDXComponents} {...rest} />
}
