import React, { useState } from 'react';
import axios from 'axios';
import { Card } from "../ui/card";
import { Button } from "../ui/button";

const resizeImage = (file, maxWidth = 1024) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculate the new image dimensions, so they fit within the maxWidth
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to a Blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, file.type, 1); // Adjust quality between 0 and 1 as needed
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = event.target.result;
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

export const AskPicture = ({query, submitName}) => {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = async (event) => {
    try {
      setError('')
      const file = event.target.files[0];
      const resizedImage = await resizeImage(file);
      const base64Image = await convertToBase64(resizedImage);
      setImage(base64Image);
    } catch (err) {
      setError('Error processing image');
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    try {
      const headers = {
        "Content-Type": "application/json"
      };

      const payload = {
        "model": "gpt-4-vision-preview",
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": query
              },
              {
                "type": "image_url",
                "image_url": {
                  "url": image
                }
              }
            ]
          }
        ],
        "max_tokens": 300
      };

      const data = await fetch("/api/ask-gpt", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(payload)
      })
        .then(response => {
          if (response.ok) {
            response.json();
          }
          throw new Error(`Error: ${response.text()}`);
        })
      setResponse(data);
    } catch (err) {
      setError(`${err}`);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept={"image/*"} />
      <Button type={"submit"} className={"mt-2"}
              onClick={handleSubmit}>{submitName}</Button>
      {response &&
        <div>{response.choices ? response.choices[0].message.content === "YES" ? "검증됨" : "실패" : ""}</div>}
      {error && <div>{error}</div>}
      {image && <div><img src={image} /></div>}
    </div>
  );
};

export default AskPicture;
