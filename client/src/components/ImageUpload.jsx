import React, { useState } from 'react';
import { upload } from '../utils/imageService';

const ImageUpload = () => {
  const [file, setFile] = useState();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [id, setImageId] = useState(null);
  const [src] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { data } = await upload(file);
    if (!data.success) {
      setError(data.message);
    } else {
      setImageId(data?.data?._id);
      setSuccess(true);
      setError(null);
    }
  };

  return (
    <>
      {src && <img alt="my" src={src} />}
      {success && <p>Bilde opplastet med {id}</p>}
      {error && <p>Noe gikk galt med opplastingen</p>}
      <form encType="multipart/form-data" method="post" onSubmit={handleSubmit}>
        <label htmlFor="image">Last opp bilde</label>
        <input
          type="file"
          id="image"
          name="image"
          accept=".jpg"
          onChange={(event) => {
            console.log(event);
            const imageFile = event.target.files[0];
            setFile(imageFile);
          }}
        />
        <button type="submit">Lagre</button>
      </form>
    </>
  );
};

export default ImageUpload;