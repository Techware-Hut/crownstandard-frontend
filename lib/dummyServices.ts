// lib/dummyServices.ts
export const DUMMY_SERVICES_DATA = {
  success: true,
  total: 6,
  page: 1,
  limit: 10,
  data: [
    {
      _id: "provider_1",
      name: "CleanPro Services",
      profilePhoto: "/ServiceCleaning.png",
      distance: 2.5,
      services: [
        {
          _id: "service_1",
          title: "House Deep Cleaning",
          basePrice: 75,
          currency: "CAD",
          priceUnit: "per_hour",
          media: ["/ServiceCleaning.png"],
          ratingSummary: {
            avg: 4.8,
            count: 45
          }
        },
        {
          _id: "service_2", 
          title: "Office Cleaning",
          basePrice: 85,
          currency: "CAD",
          priceUnit: "per_hour",
          media: ["/ServiceCleaning.png"],
          ratingSummary: {
            avg: 4.6,
            count: 32
          }
        }
      ]
    },
    {
      _id: "provider_2",
      name: "Sparkle & Shine",
      profilePhoto: "/ServiceCleaning.png", 
      distance: 1.8,
      services: [
        {
          _id: "service_3",
          title: "Apartment Cleaning",
          basePrice: 65,
          currency: "CAD", 
          priceUnit: "per_hour",
          media: ["/ServiceCleaning.png"],
          ratingSummary: {
            avg: 4.9,
            count: 67
          }
        }
      ]
    }
  ]
};
