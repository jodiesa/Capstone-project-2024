import { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    location: '',
    color: '',
    type: 'rent',
    offer: false,
    regularPrice: 500,
    discountPrice: 0,
    model: '',
    fuelType:'petrol',
    driveToMalaysia: true,
    pax: 5,
    minAge:20,
    isAvailable:true
    
  });
  




  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };





  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;
  
    if (id === 'sale' || id === 'rent') {
      setFormData((prev) => ({ ...prev, type: id }));
    } else if ([ 'offer', 'driveToMalaysia'].includes(id)) {
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else if (id === 'fuelType') {
      // Handle fuelType as a check button value
      setFormData((prev) => ({ ...prev, fuelType: value }));
    } else if (['number', 'text', 'textarea'].includes(type)) {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate discount price
    if (+formData.regularPrice < +formData.discountPrice) {
      setError('Discount price must be lower than regular price');
      return;
    }
  
    setLoading(true);
    setError(false);
  
    try {
      let imageUrls = formData.imageUrls;
  
      // Upload files if any
      if (files.length > 0) {
        const promises = files.map((file) => storeImage(file));
        const urls = await Promise.all(promises);
        imageUrls = imageUrls.concat(urls);
      }
  
      // Submit form data
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrls,
          userRef: currentUser._id,
        }),
      });
  
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError("Submission failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
        <label htmlFor='name' className='font-semibold'>Name:</label>
      <input
        type='text'
        placeholder='Name'
        className='border p-3 rounded-lg'
        id='name'
        maxLength='62'
        minLength='10'
        required
        onChange={handleChange}
        value={formData.name}
      />

      <label htmlFor='description' className='font-semibold'>Description:</label>
      <textarea
        placeholder='Description'
        className='border p-3 rounded-lg'
        id='description'
        required
        onChange={handleChange}
        value={formData.description}
      />

      <label htmlFor='location' className='font-semibold'>Location:</label>
      <input
        type='text'
        placeholder='Location'
        className='border p-3 rounded-lg'
        id='location'
        required
        onChange={handleChange}
        value={formData.location}
      />

      <label htmlFor='color' className='font-semibold'>Color:</label>
      <input
        type='text'
        placeholder='Color'
        className='border p-3 rounded-lg'
        id='color'
        required
        onChange={handleChange}
        value={formData.color}
      />

      <label htmlFor='model' className='font-semibold'>Model:</label>
      <input
        type='text'
        placeholder='Model'
        className='border p-3 rounded-lg'
        id='model'
        required
        onChange={handleChange}
        value={formData.model}
      />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={formData.offer}
              />
             
              <span>Offer</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='driveToMalaysia'
                className='w-5'
                onChange={handleChange}
                checked={formData.driveToMalaysia}
              />
             
              <span>Drive To Malaysia</span>
            </div>
            <div className='flex gap-2'>
  <input
    type='checkbox'
    id='fuelType'
    value='petrol'
    className='w-5'
    onChange={handleChange}
    checked={formData.fuelType === 'petrol'}
  />
  <span>Petrol</span>
</div>
<div className='flex gap-2'>
  <input
    type='checkbox'
    id='fuelType'
    value='electric'
    className='w-5'
    onChange={handleChange}
    checked={formData.fuelType === 'electric'}
  />
  <span>electric</span>
</div>

          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='minAge'
                min='18'
                max='100'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.minAge}
              />
              <p>Minimum Age</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='pax'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.pax}
              />
              <p>Pax</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                {formData.type === 'rent' && (
                  <span className='text-xs'>($ / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted price</p>
                  {formData.type === 'rent' && (
                    <span className='text-xs'>($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
          <input
  onChange={(e) => setFiles(Array.from(e.target.files))} // Convert FileList to an array
  className="p-3 border border-gray-300 rounded w-full"
  type="file"
  id="images"
  accept="image/*"
  multiple
/>

            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}