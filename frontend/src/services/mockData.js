// RentEase - Comprehensive Mock Data Store

export const INITIAL_PROPERTIES = [
  {
    id: 1,
    name: "Zolo Starlight Luxury Co-Living",
    description: "Premium smart co-living space in Koramangala 4th Block. High-speed 300 Mbps fiber, buffet meals 3 times a day, biometric keyless access, gaming lounge, and zero brokerage.",
    pgType: "UNISEX",
    city: "Bangalore",
    locality: "Koramangala 4th Block",
    address: "Plot 104, 80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034",
    latitude: 12.9345,
    longitude: 77.6265,
    startingPrice: 12500,
    depositAmount: 15000,
    noticePeriodDays: 30,
    verified: true,
    rating: 4.9,
    reviewCount: 48,
    foodIncluded: true,
    foodType: "VEG_NONVEG",
    gateClosingTime: "No Curfew",
    visitorsAllowed: true,
    nonVegAllowed: true,
    nearbyLandmark: "Sony World Signal",
    distanceToLandmark: "350m to Sony Signal",
    ownerId: 1,
    ownerName: "Vikram Malhotra",
    ownerPhone: "+91 98450 12345",
    status: "ACTIVE",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "High-Speed Wi-Fi",
      "3 Meals Included",
      "Air Conditioner",
      "Power Backup",
      "Attached Bathroom",
      "Daily Housekeeping",
      "Washing Machine",
      "Biometric Access",
      "Gym & Fitness",
      "Gaming Lounge"
    ],
    roomTypes: [
      {
        id: 101,
        roomCategory: "SINGLE",
        title: "Private Executive Single Room",
        pricePerMonth: 18500,
        depositAmount: 20000,
        totalBeds: 1,
        availableBeds: 1,
        hasAttachedWashroom: true,
        hasAc: true,
        hasBalcony: true
      },
      {
        id: 102,
        roomCategory: "DOUBLE",
        title: "Twin Sharing Premium Room",
        pricePerMonth: 12500,
        depositAmount: 15000,
        totalBeds: 2,
        availableBeds: 2,
        hasAttachedWashroom: true,
        hasAc: true,
        hasBalcony: false
      },
      {
        id: 103,
        roomCategory: "TRIPLE",
        title: "Triple Sharing Economy Suite",
        pricePerMonth: 9500,
        depositAmount: 12000,
        totalBeds: 3,
        availableBeds: 1,
        hasAttachedWashroom: true,
        hasAc: true,
        hasBalcony: false
      }
    ],
    reviews: [
      {
        id: 1,
        authorName: "Karan Sharma",
        authorRole: "Software Engineer at Swiggy",
        rating: 5.0,
        comment: "Super clean rooms, lightning fast internet for WFH, and wholesome food. The no-curfew policy is great for night shifts.",
        cleanlinessRating: 4.9,
        foodRating: 4.8,
        wifiRating: 5.0,
        securityRating: 5.0,
        valueRating: 4.8,
        createdAt: "2026-08-14"
      },
      {
        id: 2,
        authorName: "Priya Nair",
        authorRole: "Product Designer",
        rating: 4.8,
        comment: "Manager Vikram is extremely responsive. Weekly game nights and rooftop chilling area are highlights.",
        cleanlinessRating: 4.8,
        foodRating: 4.6,
        wifiRating: 5.0,
        securityRating: 4.9,
        valueRating: 4.7,
        createdAt: "2026-08-28"
      }
    ]
  },
  {
    id: 2,
    name: "UrbanHaven Girls Executive PG",
    description: "Dedicated safe, upscale girls PG in HSR Layout Sector 1. 24x7 security guard, CCTV coverage, biometric entry, chef-cooked nutritious meals, and fully furnished air-conditioned suites.",
    pgType: "GIRLS",
    city: "Bangalore",
    locality: "HSR Layout Sector 1",
    address: "14th Main Rd, Sector 1, HSR Layout, Bengaluru, Karnataka 560102",
    latitude: 12.9121,
    longitude: 77.6446,
    startingPrice: 10500,
    depositAmount: 12000,
    noticePeriodDays: 30,
    verified: true,
    rating: 4.8,
    reviewCount: 36,
    foodIncluded: true,
    foodType: "VEG_NONVEG",
    gateClosingTime: "10:30 PM",
    visitorsAllowed: false,
    nonVegAllowed: true,
    nearbyLandmark: "Agara Lake Park",
    distanceToLandmark: "600m to Agara Lake",
    ownerId: 2,
    ownerName: "Ananya Deshmukh",
    ownerPhone: "+91 97123 45678",
    status: "ACTIVE",
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "High-Speed Wi-Fi",
      "3 Meals Included",
      "Air Conditioner",
      "Power Backup",
      "Attached Bathroom",
      "Daily Housekeeping",
      "Washing Machine",
      "Biometric Access",
      "CCTV Security"
    ],
    roomTypes: [
      {
        id: 201,
        roomCategory: "SINGLE",
        title: "Deluxe Single Room with Balcony",
        pricePerMonth: 16000,
        depositAmount: 18000,
        totalBeds: 1,
        availableBeds: 1,
        hasAttachedWashroom: true,
        hasAc: true,
        hasBalcony: true
      },
      {
        id: 202,
        roomCategory: "DOUBLE",
        title: "Twin Sharing Air-Conditioned",
        pricePerMonth: 10500,
        depositAmount: 12000,
        totalBeds: 2,
        availableBeds: 2,
        hasAttachedWashroom: true,
        hasAc: true,
        hasBalcony: false
      }
    ],
    reviews: [
      {
        id: 3,
        authorName: "Sneha Mukherjee",
        authorRole: "Analyst, Deloitte",
        rating: 4.9,
        comment: "Best girls PG in HSR by far. Safe surroundings, great South & North Indian food options, and clean washrooms.",
        cleanlinessRating: 5.0,
        foodRating: 4.7,
        wifiRating: 4.8,
        securityRating: 5.0,
        valueRating: 4.8,
        createdAt: "2026-08-19"
      }
    ]
  },
  {
    id: 3,
    name: "TechHub Boys PG & Coliving",
    description: "Modern tech-worker focused Boys PG located 5 minutes from ITPL Whitefield. High-speed multi-WAN Wi-Fi, silent study/work pods, laundry service, healthy meals, and spacious bike parking.",
    pgType: "BOYS",
    city: "Bangalore",
    locality: "Whitefield ITPL",
    address: "Near Pattandur Agrahara Metro, Whitefield, Bengaluru, Karnataka 560066",
    latitude: 12.9798,
    longitude: 77.7289,
    startingPrice: 8000,
    depositAmount: 10000,
    noticePeriodDays: 30,
    verified: true,
    rating: 4.7,
    reviewCount: 52,
    foodIncluded: true,
    foodType: "VEG_NONVEG",
    gateClosingTime: "No Curfew",
    visitorsAllowed: true,
    nonVegAllowed: true,
    nearbyLandmark: "Pattandur Agrahara Metro",
    distanceToLandmark: "300m to Metro Station",
    ownerId: 1,
    ownerName: "Vikram Malhotra",
    ownerPhone: "+91 98450 12345",
    status: "ACTIVE",
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "High-Speed Wi-Fi",
      "3 Meals Included",
      "Power Backup",
      "Attached Bathroom",
      "Daily Housekeeping",
      "Washing Machine",
      "CCTV Security",
      "Study Lounge"
    ],
    roomTypes: [
      {
        id: 301,
        roomCategory: "SINGLE",
        title: "Single Studio Pod",
        pricePerMonth: 14000,
        depositAmount: 15000,
        totalBeds: 1,
        availableBeds: 1,
        hasAttachedWashroom: true,
        hasAc: true,
        hasBalcony: false
      },
      {
        id: 302,
        roomCategory: "DOUBLE",
        title: "Double Sharing Executive",
        pricePerMonth: 9500,
        depositAmount: 11000,
        totalBeds: 2,
        availableBeds: 1,
        hasAttachedWashroom: true,
        hasAc: false,
        hasBalcony: false
      },
      {
        id: 303,
        roomCategory: "TRIPLE",
        title: "Triple Sharing Budget",
        pricePerMonth: 8000,
        depositAmount: 9000,
        totalBeds: 3,
        availableBeds: 2,
        hasAttachedWashroom: true,
        hasAc: false,
        hasBalcony: false
      }
    ],
    reviews: [
      {
        id: 4,
        authorName: "Rohan Patel",
        authorRole: "Backend Engineer, Oracle",
        rating: 4.7,
        comment: "Walking distance to metro and ITPL. Clean rooms and unlimited Wi-Fi. Great value for tech folks.",
        cleanlinessRating: 4.6,
        foodRating: 4.5,
        wifiRating: 5.0,
        securityRating: 4.8,
        valueRating: 4.9,
        createdAt: "2026-07-22"
      }
    ]
  },
  {
    id: 4,
    name: "Nexus Coliving & Suites",
    description: "Vibrant co-living community in Phase 1 Hinjewadi. Fully furnished designer studios, cafeteria, gym, co-working workstations, regular events, and free shuttle to Infosys & Wipro campus.",
    pgType: "UNISEX",
    city: "Pune",
    locality: "Hinjewadi Phase 1",
    address: "Behind Rajiv Gandhi Infotech Park, Hinjewadi Phase 1, Pune, Maharashtra 411057",
    latitude: 18.5913,
    longitude: 73.7389,
    startingPrice: 9000,
    depositAmount: 12000,
    noticePeriodDays: 30,
    verified: true,
    rating: 4.8,
    reviewCount: 41,
    foodIncluded: true,
    foodType: "VEG_NONVEG",
    gateClosingTime: "No Curfew",
    visitorsAllowed: true,
    nonVegAllowed: true,
    nearbyLandmark: "Infosys Circle",
    distanceToLandmark: "800m to Infosys Campus",
    ownerId: 2,
    ownerName: "Ananya Deshmukh",
    ownerPhone: "+91 97123 45678",
    status: "ACTIVE",
    images: [
      "https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "High-Speed Wi-Fi",
      "3 Meals Included",
      "Air Conditioner",
      "Power Backup",
      "Attached Bathroom",
      "Daily Housekeeping",
      "Washing Machine",
      "Gym & Fitness",
      "Coworking Space"
    ],
    roomTypes: [
      {
        id: 401,
        roomCategory: "SINGLE",
        title: "Studio Apartment with Kitchenette",
        pricePerMonth: 17000,
        depositAmount: 18000,
        totalBeds: 1,
        availableBeds: 1,
        hasAttachedWashroom: true,
        hasAc: true,
        hasBalcony: true
      },
      {
        id: 402,
        roomCategory: "DOUBLE",
        title: "Twin Sharing Premium",
        pricePerMonth: 9000,
        depositAmount: 11000,
        totalBeds: 2,
        availableBeds: 2,
        hasAttachedWashroom: true,
        hasAc: true,
        hasBalcony: false
      }
    ],
    reviews: [
      {
        id: 5,
        authorName: "Aditya Joshi",
        authorRole: "Consultant, Tech Mahindra",
        rating: 4.8,
        comment: "Awesome vibe! Shuttle service to office saves so much time and hassle. Food menu changes weekly.",
        cleanlinessRating: 4.9,
        foodRating: 4.7,
        wifiRating: 4.9,
        securityRating: 4.8,
        valueRating: 4.7,
        createdAt: "2026-08-01"
      }
    ]
  },
  {
    id: 5,
    name: "Aura Elite Residences PG",
    description: "Luxury PG & serviced accommodation 5 minutes from Cyber Hub Gurgaon. Ultra-modern amenities, soundproof rooms, gourmet North & Continental meals, ergonomic Herman Miller desks.",
    pgType: "UNISEX",
    city: "Delhi NCR",
    locality: "DLF Phase 2 / Cyber City",
    address: "Sector 25, DLF Phase 2, Gurugram, Haryana 122002",
    latitude: 28.4901,
    longitude: 77.0895,
    startingPrice: 14000,
    depositAmount: 18000,
    noticePeriodDays: 30,
    verified: true,
    rating: 4.9,
    reviewCount: 65,
    foodIncluded: true,
    foodType: "VEG_NONVEG",
    gateClosingTime: "No Curfew",
    visitorsAllowed: true,
    nonVegAllowed: true,
    nearbyLandmark: "Cyber Hub Rapid Metro",
    distanceToLandmark: "400m to Cyber Hub",
    ownerId: 1,
    ownerName: "Vikram Malhotra",
    ownerPhone: "+91 98450 12345",
    status: "ACTIVE",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "High-Speed Wi-Fi",
      "3 Meals Included",
      "Air Conditioner",
      "Power Backup",
      "Attached Bathroom",
      "Daily Housekeeping",
      "Washing Machine",
      "Biometric Access",
      "Gym & Fitness",
      "Terrace Garden"
    ],
    roomTypes: [
      {
        id: 501,
        roomCategory: "SINGLE",
        title: "Executive Studio Suite",
        pricePerMonth: 22000,
        depositAmount: 25000,
        totalBeds: 1,
        availableBeds: 1,
        hasAttachedWashroom: true,
        hasAc: true,
        hasBalcony: true
      },
      {
        id: 502,
        roomCategory: "DOUBLE",
        title: "Twin Sharing Luxury Room",
        pricePerMonth: 14000,
        depositAmount: 16000,
        totalBeds: 2,
        availableBeds: 2,
        hasAttachedWashroom: true,
        hasAc: true,
        hasBalcony: false
      }
    ],
    reviews: [
      {
        id: 6,
        authorName: "Meera Sen",
        authorRole: "Product Lead at Google",
        rating: 5.0,
        comment: "Top notch accommodation in Gurgaon. High security, great community, and chef prepares restaurant quality dinners.",
        cleanlinessRating: 5.0,
        foodRating: 5.0,
        wifiRating: 5.0,
        securityRating: 5.0,
        valueRating: 4.8,
        createdAt: "2026-08-30"
      }
    ]
  },
  {
    id: 6,
    name: "Silicon Grove Luxury PG",
    description: "Premier PG for IT professionals next to Raheja Mindspace. Fiber optics, Hyderabadi & North Indian cuisine, biometric security, air-conditioned rooms with power backup.",
    pgType: "BOYS",
    city: "Hyderabad",
    locality: "Madhapur / Hitec City",
    address: "Near Mindspace Circle, Madhapur, Hyderabad, Telangana 500081",
    latitude: 17.4435,
    longitude: 78.3772,
    startingPrice: 9500,
    depositAmount: 12000,
    noticePeriodDays: 30,
    verified: true,
    rating: 4.8,
    reviewCount: 29,
    foodIncluded: true,
    foodType: "VEG_NONVEG",
    gateClosingTime: "No Curfew",
    visitorsAllowed: true,
    nonVegAllowed: true,
    nearbyLandmark: "Hitec City Metro",
    distanceToLandmark: "500m to Metro Station",
    ownerId: 2,
    ownerName: "Ananya Deshmukh",
    ownerPhone: "+91 97123 45678",
    status: "ACTIVE",
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "High-Speed Wi-Fi",
      "3 Meals Included",
      "Air Conditioner",
      "Power Backup",
      "Attached Bathroom",
      "Daily Housekeeping",
      "Washing Machine",
      "Biometric Access",
      "Gym & Fitness"
    ],
    roomTypes: [
      {
        id: 601,
        roomCategory: "SINGLE",
        title: "Single Room with Workstation",
        pricePerMonth: 16500,
        depositAmount: 18000,
        totalBeds: 1,
        availableBeds: 1,
        hasAttachedWashroom: true,
        hasAc: true,
        hasBalcony: false
      },
      {
        id: 602,
        roomCategory: "DOUBLE",
        title: "Twin Sharing Executive",
        pricePerMonth: 9500,
        depositAmount: 11000,
        totalBeds: 2,
        availableBeds: 2,
        hasAttachedWashroom: true,
        hasAc: true,
        hasBalcony: false
      }
    ],
    reviews: [
      {
        id: 7,
        authorName: "Venkat Rao",
        authorRole: "Frontend Engineer at Microsoft",
        rating: 4.8,
        comment: "Excellent location, walking distance to Mindspace gate. Good food and quiet environment.",
        cleanlinessRating: 4.8,
        foodRating: 4.7,
        wifiRating: 4.9,
        securityRating: 4.9,
        valueRating: 4.8,
        createdAt: "2026-08-11"
      }
    ]
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 1,
    bookingCode: "RE-2026-B1042",
    propertyId: 1,
    propertyName: "Zolo Starlight Luxury Co-Living",
    roomTypeId: 102,
    roomCategory: "DOUBLE",
    tenantName: "Arjun Verma",
    tenantEmail: "arjun.v@gmail.com",
    tenantPhone: "+91 99887 76655",
    idProofType: "AADHAR",
    idProofNumber: "XXXX-XXXX-9842",
    moveInDate: "2026-09-15",
    durationMonths: 6,
    monthlyRent: 12500,
    depositPaid: 15000,
    totalAmountPaid: 15000,
    bookingStatus: "CONFIRMED",
    paymentMethod: "UPI",
    paymentId: "UPI/REF/938472910",
    createdAt: "2026-09-01T10:15:00"
  },
  {
    id: 2,
    bookingCode: "RE-2026-B1098",
    propertyId: 2,
    propertyName: "UrbanHaven Girls Executive PG",
    roomTypeId: 202,
    roomCategory: "DOUBLE",
    tenantName: "Pooja Hegde",
    tenantEmail: "pooja.h@outlook.com",
    tenantPhone: "+91 98451 90812",
    idProofType: "PAN",
    idProofNumber: "ABCDE1234F",
    moveInDate: "2026-09-20",
    durationMonths: 11,
    monthlyRent: 10500,
    depositPaid: 12000,
    totalAmountPaid: 12000,
    bookingStatus: "CONFIRMED",
    paymentMethod: "CARD",
    paymentId: "TXN_774910283",
    createdAt: "2026-09-04T16:20:00"
  }
];

export const INITIAL_VISITS = [
  {
    id: 1,
    visitCode: "VST-4821",
    propertyId: 1,
    propertyName: "Zolo Starlight Luxury Co-Living",
    visitorName: "Rahul Mehta",
    visitorEmail: "rahul.m@gmail.com",
    visitorPhone: "+91 98765 43210",
    visitDate: "2026-09-12",
    timeSlot: "10:00 AM - 12:00 PM",
    visitType: "IN_PERSON",
    status: "SCHEDULED",
    notes: "Wants to inspect room ventilation and Wi-Fi speed.",
    createdAt: "2026-09-06T14:30:00"
  },
  {
    id: 2,
    visitCode: "VST-5190",
    propertyId: 4,
    propertyName: "Nexus Coliving & Suites",
    visitorName: "Divya Kulkarni",
    visitorEmail: "divya.k@gmail.com",
    visitorPhone: "+91 98231 45980",
    visitDate: "2026-09-14",
    timeSlot: "05:00 PM - 07:00 PM",
    visitType: "VIDEO_TOUR",
    status: "SCHEDULED",
    notes: "Relocating from Nagpur next month, requests live video walkthrough.",
    createdAt: "2026-09-07T09:10:00"
  }
];

export const CITIES = ["All Cities", "Bangalore", "Pune", "Delhi NCR", "Hyderabad", "Mumbai"];

export const AMENITIES_LIST = [
  "High-Speed Wi-Fi",
  "3 Meals Included",
  "Air Conditioner",
  "Power Backup",
  "Attached Bathroom",
  "Daily Housekeeping",
  "Washing Machine",
  "Biometric Access",
  "Gym & Fitness",
  "CCTV Security",
  "Gaming Lounge",
  "Coworking Space"
];
