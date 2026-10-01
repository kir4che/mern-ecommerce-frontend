import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { ABOUT, SHOP_INFO, SHOP_LIST } from "@/constants/data";

import BlurImage from "@/components/ui/BlurImage";
import Breadcrumb from "@/components/shared/Breadcrumb";

import shop1 from "@/assets/images/about/shop1.webp";
import shop2 from "@/assets/images/about/shop2.webp";
import shop3 from "@/assets/images/about/shop3.webp";
import shop4 from "@/assets/images/about/shop4.webp";
import shop5 from "@/assets/images/about/shop5.webp";

const shopImages = [shop1, shop2, shop3, shop4, shop5];

const About = () => (
  <>
    <section className="relative w-full bg-about-cover bg-cover bg-center bg-no-repeat px-5 pt-4 md:px-8">
      <div className="pointer-events-none absolute inset-0 z-0 bg-linear-to-b from-white/15 via-black/35 to-black/25" />
      <div className="relative z-10">
        <Breadcrumb text={ABOUT.title} textColor="text-white" link="about" />
        <div className="mx-auto max-w-6xl space-y-8 py-40 text-white">
          <div className="space-y-1">
            <p className="text-base">About us</p>
            <h2 className="text-4xl leading-normal">{ABOUT.title}</h2>
          </div>
          <p className="leading-7.5 whitespace-pre-line drop-shadow tablet:max-w-125">
            {ABOUT.description2}
          </p>
        </div>
      </div>
    </section>
    <section className="py-12">
      {ABOUT.details.map((detail, index) => (
        <section
          key={detail.title}
          className="border-t border-primary px-5 pt-4 pb-12 md:px-8"
        >
          <h2 className="mb-3 text-lg md:mb-0 md:text-sm">
            <span className="mr-2 text-2xl font-light">{`0${index + 1}`}</span>
            {detail.title}
          </h2>
          <div className="mx-auto flex gap-6 max-md:flex-col-reverse md:max-w-6xl md:items-center md:justify-between">
            <div className="flex-1 space-y-6">
              <h3 className="text-3xl leading-normal whitespace-pre-line">
                {detail.heading}
              </h3>
              <p className="whitespace-pre-line tablet:max-w-md">
                {detail.content}
              </p>
            </div>
            <div className="flex-1">
              <BlurImage
                src={detail.image}
                alt={detail.title.toLowerCase().split(" / ")[1]}
                className="max-h-96 w-full rounded object-cover md:max-h-120"
              />
            </div>
          </div>
        </section>
      ))}
    </section>
    <div className="w-full max-w-[100vw] overflow-hidden">
      <Swiper
        slidesPerView={4}
        spaceBetween={0}
        modules={[Autoplay]}
        autoplay={{ delay: 0, disableOnInteraction: false }}
        speed={7000}
        loop
        allowTouchMove={false}
        className="w-full [&>.swiper-wrapper]:ease-linear!"
        breakpoints={{
          0: { slidesPerView: 1.5 },
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 4 },
        }}
      >
        {shopImages.map((image, index) => (
          <SwiperSlide key={image}>
            <BlurImage
              src={image}
              className="h-112.5 w-full object-cover opacity-85"
              alt={`shop${index + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    <section className="mx-auto max-w-5xl space-y-6 px-5 py-12 md:px-8">
      <div>
        <h2 className="text-4xl">Store Info</h2>
        <p className="text-base">店家資訊</p>
      </div>
      {SHOP_LIST.map((shop) => (
        <div
          key={shop.name}
          className="flex justify-between gap-x-10 gap-y-6 max-md:flex-col"
        >
          <div className="max-w-xl flex-1">
            <img
              src={shop.imageUrl}
              alt={shop.name}
              className="max-h-60 w-full object-cover md:max-h-80"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="space-y-4 md:min-w-96 md:space-y-8">
            <p className="text-2xl font-medium">
              {shop.name}
              <span className="ml-1.5 text-base font-normal text-primary/45">
                {shop.alias}
              </span>
            </p>
            <ul>
              {"info" in shop &&
              shop.info &&
              Object.keys(shop.info).length > 0 ? (
                Object.entries(shop.info).map(([key, value]) => (
                  <li key={key} className="py-2">
                    <span className="mr-3 rounded bg-primary/10 px-2 py-1 text-sm font-medium">
                      {SHOP_INFO[key as keyof typeof SHOP_INFO]}
                    </span>
                    {value as React.ReactNode}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">即將開幕</li>
              )}
            </ul>
          </div>
        </div>
      ))}
    </section>
  </>
);

export default About;
