import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import styles from '../styles/Banner.module.css'; // You'll need to create this CSS module

const SecondBanners = ({ banners = [] }) => {
    // Default banners if none are provided
    const defaultBanners = [
        {
            id: 1,
            imageUrl: "/images/banner3.webp",
            altText: "Special Offer",
            link: "/deals",
        },
        {
            id: 2,
            imageUrl: "/images/banner4.webp",
            altText: "New Arrivals",
            link: "/deals",
        },
    ];

    // Use provided banners or default ones
    const displayBanners = banners.length > 0 ? banners : defaultBanners;

    return (
        <section className="banner-section py-8">
            <div className="mx-auto max-w-screen-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                    {displayBanners.slice(0, 2).map((banner) => (
                        <Link href={banner.link} key={banner.id} className="block">
                            <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-32 bg-gray-100">
                                <Image src={banner.imageUrl} alt={banner.altText} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />

                                <div className="absolute inset-0 flex items-center">
                                    <div className="max-w-2xl mx-4 sm:mx-6 lg:mx-8 w-full">
                                        {/* <div className="bg-gradient-to-r from-black/60 via-black/20 to-transparent rounded p-4 sm:p-6 md:p-8 w-full md:w-3/4 lg:w-2/3">
                                            {banner.overlayTitle ? (
                                                <h3 className="text-white text-lg sm:text-2xl md:text-3xl font-extrabold">{banner.overlayTitle}</h3>
                                            ) : (
                                                <h3 className="text-white text-lg sm:text-2xl md:text-3xl font-extrabold">{banner.altText}</h3>
                                            )}
                                            {banner.overlaySubtitle && (
                                                <p className="mt-2 text-sm sm:text-base text-white/90">{banner.overlaySubtitle}</p>
                                            )}
                                            {banner.ctaText && (
                                                <div className="mt-4">
                                                    <span className="inline-block bg-white text-gray-900 font-semibold px-4 py-2 rounded shadow-sm">{banner.ctaText}</span>
                                                </div>
                                            )}
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SecondBanners;