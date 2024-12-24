import express from "express"
import { changeJobApplicantsStatus, changeVisiblity, getCompanyData, getCompanyJobApplicants, getCompanyJobApplicantsBySearch, getCompanyPostedJobs, getCompanyPostedJobsBySearch, loginCompany, postJob, registerCompany } from "../controllers/companyController.js";
import upload from "../config/multer.js";
import { protectCompany } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", upload.single('image'), registerCompany)

router.post("/login", loginCompany)

router.get("/company", protectCompany, getCompanyData)

router.post("/post-job", protectCompany, postJob);

router.get("/applicants", protectCompany, getCompanyJobApplicants);

router.get("/applicants-search", protectCompany, getCompanyJobApplicantsBySearch);

router.get("/list-jobs",protectCompany, getCompanyPostedJobs);

router.get("/list-jobs-search",protectCompany, getCompanyPostedJobsBySearch);

router.post("/change-status", protectCompany,  changeJobApplicantsStatus);

router.post("/change-visiblity", protectCompany, changeVisiblity);

export default router
