package com.rentease.config;

import com.rentease.model.*;
import com.rentease.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final PropertyRepository propertyRepository;
    private final OwnerRepository ownerRepository;
    private final BookingRepository bookingRepository;
    private final VisitRepository visitRepository;

    public DataInitializer(PropertyRepository propertyRepository,
                           OwnerRepository ownerRepository,
                           BookingRepository bookingRepository,
                           VisitRepository visitRepository) {
        this.propertyRepository = propertyRepository;
        this.ownerRepository = ownerRepository;
        this.bookingRepository = bookingRepository;
        this.visitRepository = visitRepository;
    }

    @Override
    public void run(String... args) {
        if (propertyRepository.count() > 0) {
            return; // already seeded
        }

        // 1. Seed Owners
        Owner owner1 = new Owner();
        owner1.setName("Vikram Malhotra");
        owner1.setEmail("vikram.m@rentease.io");
        owner1.setPhone("+91 98450 12345");
        owner1.setAgencyName("Malhotra Luxury Living");
        owner1.setVerified(true);
        owner1.setRating(4.9);
        owner1 = ownerRepository.save(owner1);

        Owner owner2 = new Owner();
        owner2.setName("Ananya Deshmukh");
        owner2.setEmail("ananya.d@rentease.io");
        owner2.setPhone("+91 97123 45678");
        owner2.setAgencyName("UrbanNest Co-living Spaces");
        owner2.setVerified(true);
        owner2.setRating(4.8);
        owner2 = ownerRepository.save(owner2);

        // 2. Seed Properties

        // Property 1: Bangalore - Koramangala
        Property p1 = new Property();
        p1.setName("Zolo Starlight Luxury Co-Living");
        p1.setDescription("Premium smart co-living space located in the heartbeat of Koramangala 4th Block. High-speed 300 Mbps fiber, hot buffet meals 3 times a day, biometric keyless access, gaming lounge, and zero brokerage.");
        p1.setPgType("UNISEX");
        p1.setCity("Bangalore");
        p1.setLocality("Koramangala 4th Block");
        p1.setAddress("Plot 104, 80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034");
        p1.setLatitude(12.9345);
        p1.setLongitude(77.6265);
        p1.setStartingPrice(new BigDecimal("12500"));
        p1.setDepositAmount(new BigDecimal("15000"));
        p1.setNoticePeriodDays(30);
        p1.setVerified(true);
        p1.setRating(4.9);
        p1.setReviewCount(48);
        p1.setFoodIncluded(true);
        p1.setFoodType("VEG_NONVEG");
        p1.setGateClosingTime("No Curfew");
        p1.setVisitorsAllowed(true);
        p1.setNonVegAllowed(true);
        p1.setNearbyLandmark("Sony World Signal");
        p1.setDistanceToLandmark("350m to Sony Signal");
        p1.setOwnerId(owner1.getId());
        p1.setOwnerName(owner1.getName());
        p1.setOwnerPhone(owner1.getPhone());
        p1.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
        ));
        p1.setAmenities(Arrays.asList("Wi-Fi", "3 Meals Included", "AC", "Power Backup", "Attached Bathroom", "Daily Housekeeping", "Washing Machine", "Biometric Access", "Gym", "Gaming Zone"));

        RoomType r1_1 = createRoom(p1, "SINGLE", "Private Executive Single Room", new BigDecimal("18500"), new BigDecimal("20000"), 1, 1, true, true, true);
        RoomType r1_2 = createRoom(p1, "DOUBLE", "Twin Sharing Premium Room", new BigDecimal("12500"), new BigDecimal("15000"), 2, 2, true, true, false);
        RoomType r1_3 = createRoom(p1, "TRIPLE", "Triple Sharing Economy Suite", new BigDecimal("9500"), new BigDecimal("12000"), 3, 1, true, true, false);
        p1.setRoomTypes(Arrays.asList(r1_1, r1_2, r1_3));

        Review rev1 = createReview(p1, "Karan Sharma", "Software Engineer at Swiggy", 5.0, "Super clean rooms, lightning fast internet for WFH, and wholesome food. The no-curfew policy is great for night shifts.", 4.9, 4.8, 5.0, 5.0, 4.8);
        Review rev2 = createReview(p1, "Priya Nair", "Product Designer", 4.8, "Manager Vikram is extremely responsive. Weekly game nights and rooftop chilling area are highlights.", 4.8, 4.6, 5.0, 4.9, 4.7);
        p1.setReviews(Arrays.asList(rev1, rev2));
        propertyRepository.save(p1);

        // Property 2: Bangalore - HSR Layout
        Property p2 = new Property();
        p2.setName("UrbanHaven Girls Executive PG");
        p2.setDescription("Dedicated safe, upscale girls PG in HSR Layout Sector 1. 24x7 security guard, CCTV coverage, biometric entry, chef-cooked nutritious meals, and fully furnished air-conditioned suites.");
        p2.setPgType("GIRLS");
        p2.setCity("Bangalore");
        p2.setLocality("HSR Layout Sector 1");
        p2.setAddress("14th Main Rd, Sector 1, HSR Layout, Bengaluru, Karnataka 560102");
        p2.setLatitude(12.9121);
        p2.setLongitude(77.6446);
        p2.setStartingPrice(new BigDecimal("10500"));
        p2.setDepositAmount(new BigDecimal("12000"));
        p2.setNoticePeriodDays(30);
        p2.setVerified(true);
        p2.setRating(4.8);
        p2.setReviewCount(36);
        p2.setFoodIncluded(true);
        p2.setFoodType("VEG_NONVEG");
        p2.setGateClosingTime("10:30 PM");
        p2.setVisitorsAllowed(false);
        p2.setNonVegAllowed(true);
        p2.setNearbyLandmark("Agara Lake Park");
        p2.setDistanceToLandmark("600m to Agara Lake");
        p2.setOwnerId(owner2.getId());
        p2.setOwnerName(owner2.getName());
        p2.setOwnerPhone(owner2.getPhone());
        p2.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
        ));
        p2.setAmenities(Arrays.asList("Wi-Fi", "3 Meals Included", "AC", "Power Backup", "Attached Bathroom", "Daily Housekeeping", "Washing Machine", "Biometric Access", "CCTV Security"));

        RoomType r2_1 = createRoom(p2, "SINGLE", "Deluxe Single Room with Balcony", new BigDecimal("16000"), new BigDecimal("18000"), 1, 1, true, true, true);
        RoomType r2_2 = createRoom(p2, "DOUBLE", "Twin Sharing Air-Conditioned", new BigDecimal("10500"), new BigDecimal("12000"), 2, 2, true, true, false);
        p2.setRoomTypes(Arrays.asList(r2_1, r2_2));

        Review rev3 = createReview(p2, "Sneha Mukherjee", "Analyst, Deloitte", 4.9, "Best girls PG in HSR by far. Safe surroundings, great South & North Indian food options, and clean washrooms.", 5.0, 4.7, 4.8, 5.0, 4.8);
        p2.setReviews(Arrays.asList(rev3));
        propertyRepository.save(p2);

        // Property 3: Bangalore - Whitefield
        Property p3 = new Property();
        p3.setName("TechHub Boys PG & Coliving");
        p3.setDescription("Modern tech-worker focused Boys PG located 5 minutes from ITPL Whitefield. High-speed multi-WAN Wi-Fi, silent study/work pods, laundry service, healthy meals, and spacious bike parking.");
        p3.setPgType("BOYS");
        p3.setCity("Bangalore");
        p3.setLocality("Whitefield ITPL");
        p3.setAddress("Near Pattandur Agrahara Metro, Whitefield, Bengaluru, Karnataka 560066");
        p3.setLatitude(12.9798);
        p3.setLongitude(77.7289);
        p3.setStartingPrice(new BigDecimal("8000"));
        p3.setDepositAmount(new BigDecimal("10000"));
        p3.setNoticePeriodDays(30);
        p3.setVerified(true);
        p3.setRating(4.7);
        p3.setReviewCount(52);
        p3.setFoodIncluded(true);
        p3.setFoodType("VEG_NONVEG");
        p3.setGateClosingTime("No Curfew");
        p3.setVisitorsAllowed(true);
        p3.setNonVegAllowed(true);
        p3.setNearbyLandmark("Pattandur Agrahara Metro");
        p3.setDistanceToLandmark("300m to Metro Station");
        p3.setOwnerId(owner1.getId());
        p3.setOwnerName(owner1.getName());
        p3.setOwnerPhone(owner1.getPhone());
        p3.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
        ));
        p3.setAmenities(Arrays.asList("Wi-Fi", "3 Meals Included", "Power Backup", "Attached Bathroom", "Daily Housekeeping", "Washing Machine", "CCTV Security", "Study Lounge"));

        RoomType r3_1 = createRoom(p3, "SINGLE", "Single Studio Pod", new BigDecimal("14000"), new BigDecimal("15000"), 1, 1, true, true, false);
        RoomType r3_2 = createRoom(p3, "DOUBLE", "Double Sharing Executive", new BigDecimal("9500"), new BigDecimal("11000"), 2, 1, true, false, false);
        RoomType r3_3 = createRoom(p3, "TRIPLE", "Triple Sharing Budget", new BigDecimal("8000"), new BigDecimal("9000"), 3, 2, true, false, false);
        p3.setRoomTypes(Arrays.asList(r3_1, r3_2, r3_3));
        propertyRepository.save(p3);

        // Property 4: Pune - Hinjewadi
        Property p4 = new Property();
        p4.setName("Nexus Coliving & Suites");
        p4.setDescription("Vibrant co-living community in Phase 1 Hinjewadi. Fully furnished designer studios, cafeteria, gym, co-working workstations, regular events, and free shuttle to Infosys & Wipro campus.");
        p4.setPgType("UNISEX");
        p4.setCity("Pune");
        p4.setLocality("Hinjewadi Phase 1");
        p4.setAddress("Behind Rajiv Gandhi Infotech Park, Hinjewadi Phase 1, Pune, Maharashtra 411057");
        p4.setLatitude(18.5913);
        p4.setLongitude(73.7389);
        p4.setStartingPrice(new BigDecimal("9000"));
        p4.setDepositAmount(new BigDecimal("12000"));
        p4.setNoticePeriodDays(30);
        p4.setVerified(true);
        p4.setRating(4.8);
        p4.setReviewCount(41);
        p4.setFoodIncluded(true);
        p4.setFoodType("VEG_NONVEG");
        p4.setGateClosingTime("No Curfew");
        p4.setVisitorsAllowed(true);
        p4.setNonVegAllowed(true);
        p4.setNearbyLandmark("Infosys Circle");
        p4.setDistanceToLandmark("800m to Infosys Campus");
        p4.setOwnerId(owner2.getId());
        p4.setOwnerName(owner2.getName());
        p4.setOwnerPhone(owner2.getPhone());
        p4.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80"
        ));
        p4.setAmenities(Arrays.asList("Wi-Fi", "3 Meals Included", "AC", "Power Backup", "Attached Bathroom", "Daily Housekeeping", "Washing Machine", "Gym", "Coworking Space"));

        RoomType r4_1 = createRoom(p4, "SINGLE", "Studio Apartment with Kitchenette", new BigDecimal("17000"), new BigDecimal("18000"), 1, 1, true, true, true);
        RoomType r4_2 = createRoom(p4, "DOUBLE", "Twin Sharing Premium", new BigDecimal("9000"), new BigDecimal("11000"), 2, 2, true, true, false);
        p4.setRoomTypes(Arrays.asList(r4_1, r4_2));
        propertyRepository.save(p4);

        // Property 5: Delhi NCR - Cyber City Gurgaon
        Property p5 = new Property();
        p5.setName("Aura Elite Residences PG");
        p5.setDescription("Luxury PG & serviced accommodation 5 minutes from Cyber Hub Gurgaon. Ultra-modern amenities, soundproof rooms, gourmet North & Continental meals, ergonomic Herman Miller desks.");
        p5.setPgType("UNISEX");
        p5.setCity("Delhi NCR");
        p5.setLocality("DLF Phase 2 / Cyber City");
        p5.setAddress("Sector 25, DLF Phase 2, Gurugram, Haryana 122002");
        p5.setLatitude(28.4901);
        p5.setLongitude(77.0895);
        p5.setStartingPrice(new BigDecimal("14000"));
        p5.setDepositAmount(new BigDecimal("18000"));
        p5.setNoticePeriodDays(30);
        p5.setVerified(true);
        p5.setRating(4.9);
        p5.setReviewCount(65);
        p5.setFoodIncluded(true);
        p5.setFoodType("VEG_NONVEG");
        p5.setGateClosingTime("No Curfew");
        p5.setVisitorsAllowed(true);
        p5.setNonVegAllowed(true);
        p5.setNearbyLandmark("Cyber Hub Rapid Metro");
        p5.setDistanceToLandmark("400m to Cyber Hub");
        p5.setOwnerId(owner1.getId());
        p5.setOwnerName(owner1.getName());
        p5.setOwnerPhone(owner1.getPhone());
        p5.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"
        ));
        p5.setAmenities(Arrays.asList("Wi-Fi", "3 Meals Included", "AC", "Power Backup", "Attached Bathroom", "Daily Housekeeping", "Washing Machine", "Biometric Access", "Gym", "Terrace Garden"));

        RoomType r5_1 = createRoom(p5, "SINGLE", "Executive Studio Suite", new BigDecimal("22000"), new BigDecimal("25000"), 1, 1, true, true, true);
        RoomType r5_2 = createRoom(p5, "DOUBLE", "Twin Sharing Luxury Room", new BigDecimal("14000"), new BigDecimal("16000"), 2, 2, true, true, false);
        p5.setRoomTypes(Arrays.asList(r5_1, r5_2));
        propertyRepository.save(p5);

        // Property 6: Hyderabad - Hitec City
        Property p6 = new Property();
        p6.setName("Silicon Grove Luxury PG");
        p6.setDescription("Premier PG for IT professionals next to Raheja Mindspace. Fiber optics, Hyderabadi & North Indian cuisine, biometric security, air-conditioned rooms with power backup.");
        p6.setPgType("BOYS");
        p6.setCity("Hyderabad");
        p6.setLocality("Madhapur / Hitec City");
        p6.setAddress("Near Mindspace Circle, Madhapur, Hyderabad, Telangana 500081");
        p6.setLatitude(17.4435);
        p6.setLongitude(78.3772);
        p6.setStartingPrice(new BigDecimal("9500"));
        p6.setDepositAmount(new BigDecimal("12000"));
        p6.setNoticePeriodDays(30);
        p6.setVerified(true);
        p6.setRating(4.8);
        p6.setReviewCount(29);
        p6.setFoodIncluded(true);
        p6.setFoodType("VEG_NONVEG");
        p6.setGateClosingTime("No Curfew");
        p6.setVisitorsAllowed(true);
        p6.setNonVegAllowed(true);
        p6.setNearbyLandmark("Hitec City Metro");
        p6.setDistanceToLandmark("500m to Metro Station");
        p6.setOwnerId(owner2.getId());
        p6.setOwnerName(owner2.getName());
        p6.setOwnerPhone(owner2.getPhone());
        p6.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80"
        ));
        p6.setAmenities(Arrays.asList("Wi-Fi", "3 Meals Included", "AC", "Power Backup", "Attached Bathroom", "Daily Housekeeping", "Washing Machine", "Biometric Access", "Gym"));

        RoomType r6_1 = createRoom(p6, "SINGLE", "Single Room with Workstation", new BigDecimal("16500"), new BigDecimal("18000"), 1, 1, true, true, false);
        RoomType r6_2 = createRoom(p6, "DOUBLE", "Twin Sharing Executive", new BigDecimal("9500"), new BigDecimal("11000"), 2, 2, true, true, false);
        p6.setRoomTypes(Arrays.asList(r6_1, r6_2));
        propertyRepository.save(p6);

        // 3. Seed Sample Bookings
        Booking b1 = new Booking();
        b1.setBookingCode("RE-2026-B1042");
        b1.setPropertyId(p1.getId());
        b1.setPropertyName(p1.getName());
        b1.setRoomTypeId(r1_2.getId());
        b1.setRoomCategory("DOUBLE");
        b1.setTenantName("Arjun Verma");
        b1.setTenantEmail("arjun.v@gmail.com");
        b1.setTenantPhone("+91 99887 76655");
        b1.setIdProofType("AADHAR");
        b1.setIdProofNumber("XXXX-XXXX-9842");
        b1.setMoveInDate(LocalDate.now().plusDays(5));
        b1.setDurationMonths(6);
        b1.setMonthlyRent(new BigDecimal("12500"));
        b1.setDepositPaid(new BigDecimal("15000"));
        b1.setTotalAmountPaid(new BigDecimal("15000"));
        b1.setBookingStatus("CONFIRMED");
        b1.setPaymentMethod("UPI");
        b1.setPaymentId("UPI/REF/938472910");
        bookingRepository.save(b1);

        // 4. Seed Sample Visits
        Visit v1 = new Visit();
        v1.setVisitCode("VST-4821");
        v1.setPropertyId(p1.getId());
        v1.setPropertyName(p1.getName());
        v1.setVisitorName("Rahul Mehta");
        v1.setVisitorEmail("rahul.m@gmail.com");
        v1.setVisitorPhone("+91 98765 43210");
        v1.setVisitDate(LocalDate.now().plusDays(2));
        v1.setTimeSlot("10:00 AM - 12:00 PM");
        v1.setVisitType("IN_PERSON");
        v1.setStatus("SCHEDULED");
        v1.setNotes("Wants to inspect room ventilation and Wi-Fi speed.");
        visitRepository.save(v1);

        System.out.println("✅ RentEase database successfully initialized with verified PGs, rooms, bookings & visits!");
    }

    private RoomType createRoom(Property p, String category, String title, BigDecimal price, BigDecimal deposit, int beds, int avail, boolean washroom, boolean ac, boolean balcony) {
        RoomType r = new RoomType();
        r.setProperty(p);
        r.setRoomCategory(category);
        r.setTitle(title);
        r.setPricePerMonth(price);
        r.setDepositAmount(deposit);
        r.setTotalBeds(beds);
        r.setAvailableBeds(avail);
        r.setHasAttachedWashroom(washroom);
        r.setHasAc(ac);
        r.setHasBalcony(balcony);
        return r;
    }

    private Review createReview(Property p, String author, String role, Double rating, String comment, Double clean, Double food, Double wifi, Double sec, Double val) {
        Review rev = new Review();
        rev.setProperty(p);
        rev.setAuthorName(author);
        rev.setAuthorRole(role);
        rev.setRating(rating);
        rev.setComment(comment);
        rev.setCleanlinessRating(clean);
        rev.setFoodRating(food);
        rev.setWifiRating(wifi);
        rev.setSecurityRating(sec);
        rev.setValueRating(val);
        return rev;
    }
}
