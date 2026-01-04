import { supabase } from "@/lib/api/base";
import { decode, encode } from 'base64-arraybuffer'

export type DrawingImage = {
  model: string,
  category: string,
  keywords: string,
  url: string,
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const uploadImage = async (item: string, size: string, file: string) => {

  const path = `private/${item}-${size}-${uuid()}.png`
  const res = await supabase.storage
    .from('public-drawing')
    .upload(path, decode(file), {
      contentType: 'image/png',
      cacheControl: '3600',
      upsert: false
    })
  await insertImage([{
    model: 'dall-e-2',
    category: 'animal',
    keywords: item,
    url: path
  }])
  return res
}

export const insertImage = async (images: DrawingImage[]) => {
  return await supabase
    .from('drawing-images')
    // @ts-ignore
    .insert(images)
}

export const selectImage = async (keyword: string) => {
  const images = await supabase
    .from('drawing-images')
    .select('*')
    // @ts-ignore
    .eq('keywords', keyword)

  const { data, error } = images
  // select random data
  if (data && data.length >= 5) {
    console.log('image list', data)
    // @ts-ignore
    const file = data[Math.floor(Math.random() * data.length)].url
    // @ts-ignore
    const { data: image, error: urlError } = await supabase.storage.from('public-drawing').download(file)
    if (image) {
      console.log("image", image)
      return encode(await image.arrayBuffer())
    } else {
      console.log("failed to get image url error", urlError)
      return null
    }
  } else {
    console.log("failed to get image error", error)
    return null
  }
}