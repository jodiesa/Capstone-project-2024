import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaBicycle,
  FaCarAlt,
  FaCalendarCheck,
  FaRegThumbsUp,
  FaGasPump,
  FaUser 
} from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setIsBooked(!data.isAvailable); // Reflect the latest availability status
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
  
    // Fetch listing when component mounts or when params.listingId changes
    fetchListing();
  }, [params.listingId]);
  

  const handleBooking = async () => {
    try {
      const res = await fetch(`/api/listing/book/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();

      if (data.success) {
        setIsBooked(true); // Mark listing as booked in the frontend
        setListing((prev) => ({ ...prev, isAvailable: false }));
        navigate('/'); // Redirect to homepage
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Booking failed. Please try again.');
    }
  };

  const isListingOwner = currentUser && listing && listing.userRef === currentUser._id;

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}
      {listing && (
        <div>
          {isBooked && (
            <div className="bg-red-800 text-white text-center p-2 uppercase font-semibold">
              This listing is booked and no longer available for booking.
            </div>
          )}
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name} - ${' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.location}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Model - </span>
              {listing.model}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.minAge} min Age
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaUser className='text-lg' />
                {listing.pax} People Maximum
              </li>
              {listing.fuelType === 'electronic' ? (
                <li className='flex items-center gap-1 whitespace-nowrap '>
                  <FaBicycle className='text-lg' />
                  Electric
                </li>
              ) : (
                <li className='flex items-center gap-1 whitespace-nowrap '>
                  <FaGasPump className='text-lg' />
                  Petrol
                </li>
              )}
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaCarAlt className='text-lg' />
                {listing.driveToMalaysia ? 'Drive to Malaysia Allowed' : 'Not allowed in Malaysia'}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
              >
                Enquire about this car
              </button>
            )}
            {contact && <Contact listing={listing} />}
                    {/* Book Button */}
{!isBooked && (
  <button
    onClick={handleBooking}
    className={`bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3 ${
      isListingOwner ? 'opacity-50 cursor-not-allowed' : ''
    }`}
    disabled={isListingOwner}
    title={isListingOwner ? 'You cannot book your own listing' : 'Book this listing'}
  >
    Book
  </button>
)}
          </div>


        </div>
      )}
    </main>
  );
}
