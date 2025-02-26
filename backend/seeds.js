const mongoose = require("mongoose");
const Doctor = require("./models/Doctor");
require("dotenv").config();

const seedDoctors = [
  {
    name: "Dr. Priya Sharma",
    workingHours: { start: "09:00", end: "17:00" },
    specialization: "Prenatal Care",
    image:
      "https://i.pinimg.com/736x/c5/a3/90/c5a3904b38eb241dd03dd30889599dc4.jpg",
  },
  {
    name: "Dr. Arjun Patel",
    workingHours: { start: "08:30", end: "16:30" },
    specialization: "Ultrasound",
    image: "https://thumbnails.yayimages.com/1600/1/7f7/17f724e.jpg",
  },
  {
    name: "Dr. Neha Gupta",
    workingHours: { start: "10:00", end: "18:00" },
    specialization: "General Medicine",
    image:
      "https://as2.ftcdn.net/jpg/03/33/03/77/1000_F_333037736_4OEVPbfD4qGGugaOUMZt5LNxQmDao1Hi.jpg",
  },
  {
    name: "Dr. Vikram Singh",
    workingHours: { start: "09:30", end: "17:30" },
    image:
      "https://as2.ftcdn.net/jpg/01/85/39/55/1000_F_185395570_wUzaCFaFP6Nm7NxWvk5xCMLAdh12nSCZ.jpg",
  },
  {
    name: "Dr. Anjali Rao",
    workingHours: { start: "08:00", end: "16:00" },
    specialization: "Pediatrics",
    image:
      "https://as2.ftcdn.net/jpg/03/20/74/45/1000_F_320744517_TaGkT7aRlqqWdfGUuzRKDABtFEoN5CiO.jpg",
  },
  {
    name: "Dr. Rohan Mehra",
    workingHours: { start: "11:00", end: "19:00" },
    specialization: "Obstetrics",
    image:
      "https://as2.ftcdn.net/jpg/02/45/92/11/1000_F_245921195_8btMKM5TqLVUcxVhcJobvIn9HtAOhSTg.jpg",
  },
  {
    name: "Dr. Kavita Desai",
    workingHours: { start: "09:00", end: "15:00" },
    specialization: "Nutrition",
    image:
      "https://png.pngtree.com/png-clipart/20231003/original/pngtree-indian-doctor-portrait-female-photo-png-image_13243893.png",
  },
  {
    name: "Dr. Sanjay Kumar",
    workingHours: { start: "10:30", end: "18:30" },
    specialization: "Family Medicine",
    image:
      "https://as2.ftcdn.net/jpg/02/69/98/99/1000_F_269989951_9Gf7PWaRtrpm2EochO3D5WVn22sFZbNZ.jpg",
  },
  {
    name: "Dr. Pooja Nair",
    workingHours: { start: "07:30", end: "15:30" },
    specialization: "Prenatal Care",
    image:
      "https://png.pngtree.com/png-clipart/20231108/original/pngtree-indian-female-doctor-medicine-picture-image_13240976.png",
  },
  {
    name: "Dr. Rahul Joshi",
    workingHours: { start: "12:00", end: "20:00" },
    specialization: "Ultrasound",
    image:
      "https://as1.ftcdn.net/jpg/01/67/15/98/1000_F_167159846_MCrwVzB7ysdZKr2vIiJkiCacEoNWagdn.jpg",
  },
];

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    // Clear existing doctors (optional)
    await Doctor.deleteMany({});
    console.log("Cleared existing doctors");

    // Insert new dummy data
    await Doctor.insertMany(seedDoctors);
    console.log("Doctors seeded successfully");

    mongoose.connection.close();
    console.log("Database connection closed");
  })
  .catch((error) => {
    console.error("Error seeding doctors:", error);
    mongoose.connection.close();
  });
