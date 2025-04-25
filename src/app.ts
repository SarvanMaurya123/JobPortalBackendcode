import("dotenv/config");
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

//jobseeker router
import loginregisterlogout from "../src/routes/jobseeker/registerloginlogout.routers"
import JobseekerProfileBasicInfoRoute from "../src/routes/jobseeker/jobseekerProfilebasicinfoRoutes";
import Skilssection from "../src/routes/jobseeker/skill.routes";
import JobseekerProfileWorkExperience from "../src/routes/jobseeker/experienceRoutes";
import JobseekerProfileEducation from "../src/routes/jobseeker/educationRoutes";
import JobseekerProfileProgress from "../src/routes/jobseeker/progressRoutes";
import JobseekerProfile from "../src/routes/jobseeker/getalljobseekerinfoRouter";
// employer router

import Registerloginlogoutemployers from "../src/routes/employer/auth.router"
import EmployeeJobCreate from "../src/routes/employer/employerjobpostRoute";

const app = express();
// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CORS,
    methods: 'GET,POST,DELETE,PATCH,HEAD,PUT',
    credentials: true
}));

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// jobseeker routes
app.use("/api/v1/jobseeker", loginregisterlogout)
app.use("/api/v1/jobseeker", JobseekerProfileBasicInfoRoute)
app.use("/api/v1/jobseeker", Skilssection)
app.use("/api/v1/jobseeker", JobseekerProfileWorkExperience, JobseekerProfileEducation, JobseekerProfileProgress, JobseekerProfile)

// employer router
app.use("/api/v1/employer", Registerloginlogoutemployers, EmployeeJobCreate);

export default app;
