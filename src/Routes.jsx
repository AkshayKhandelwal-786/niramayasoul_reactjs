
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Pharmacy from "./pages/Pharmacy";
import Pathology from "./pages/Pathology";
import PrepPep from "./pages/PrepPep";
import HivArt from "./pages/HivArt";
import Hrt from "./pages/Hrt";
import Refund from "./pages/Static/Refund";
import Policies from "./pages/Static/Policies";
import Terms from "./pages/Static/Terms";
import Shipping from "./pages/Static/Shipping";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import ForgotPwd from "./pages/Auth/ForgotPwd";
// import OtpVerify from "./pages/Auth/OtpVerify";
import ResetPassword from "./pages/Auth/ResetPassword";
import Wellness from "./pages/Wellness";
import MedicinesList from "./pages/Medicines/MedicinesList";
import DoctorListing from "./pages/Doctors/DoctorListing";
import MedicinesBrandList from "./pages/Medicines/MedicinesBrandList";
import MedicineDetails from "./pages/Medicines/MedicineDetails";
import DoctorProfile from "./pages/Doctors/DoctorProfile";
import Cart from "./pages/Cart/Cart";
import Success from "./pages/Success";
import DoctorAppointment from "./pages/Doctors/DoctorAppointment";
import Error from "./pages/Error";
import Labtest from "./pages/Pathology/Labtest";
import Packages from "./pages/Pathology/Packages";
import HealthConcernLabTest from "./pages/Pathology/HealthConcernLabTest";
import HealthConcernPackage from "./pages/Pathology/HealthConcernPackage";
import PackageDetails from "./pages/Pathology/PackageDetails";
import PackageBooking from "./pages/Pathology/PackageBooking";
import PackageBookingConfirm from "./pages/Pathology/PackageBookingConfirm";
import Transgender from "./pages/Wellness/Transgender";
import AidsCompressiveGuide from "./pages/Wellness/AidsCompressiveGuide";
import EmpowerHealth from "./pages/Wellness/EmpowerHealth";
import LabTestCart from "./pages/Pathology/LabTestCart";
import LabTestBook from "./pages/Pathology/LabTestBook";
import LabTestConfirm from "./pages/Pathology/LabTestConfirm";
import Dashboard from "./pages/Dashboard/Dashboard";
import ChangePassword from "./pages/Dashboard/ChangePassword";
import MyLabTest from "./pages/Dashboard/MyLabTest";
import MyDocConsultation from "./pages/Dashboard/MyDocConsultation";
import MyMedOrders from "./pages/Dashboard/MyMedOrders";
import MyPaymentMethod from "./pages/Dashboard/MyPaymentMethod";
import Logout from "./components/Logout";
import MyWishList from "./pages/Dashboard/MyWishList";
import Offers from "./pages/Dashboard/Offers";
import MyAddress from "./pages/Dashboard/MyAddress";
import MyNotifications from "./pages/Dashboard/MyNotifications";
import MyPackageTest from "./pages/Dashboard/MyPackageTest";
import EditProfile from "./pages/Dashboard/EditProfile";
import ProtectedRoute from "./utils/ProtectedRoute"; // Import the ProtectedRoute
import LabTestDetails from "./pages/Dashboard/LabTestDetails";
import MyPackageDetails from "./pages/Dashboard/MyPackageDetails";
import MyDocConsultationDetails from "./pages/Dashboard/MyDocConsultationDetails";
import MyMedOrdersDetails from "./pages/Dashboard/MyMedOrdersDetails";
import SearchResults from "./components/SearchResults";
import JwtToken from "./pages/JwtToken";
import PhoneAuth from "./PhoneAuth";
import Enquiry from "./pages/Static/Enquiry";
import OrderByWatsapp from "./OrderByWatsapp";
import useConditionalCSS from './utils/useConditionalCSS';
import Brands from "./pages/Medicines/Brands";

// function Routing() {
//   return (
//     <div className="App">
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Home />}></Route>
//           <Route path="/phone" element={<PhoneAuth />}></Route>
//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// }

// export default Routing;

const Routing = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home />}></Route>
          <Route path="/logout" element={<Logout />}></Route>
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/order-by-whatsapp" element={<OrderByWatsapp/>} />
          {/* 404 page */}
          <Route path="*" element={<Error />} />
          {/* dashboard */}
          {/* Protected dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/payment-methods"
            element={
              <ProtectedRoute>
                <MyPaymentMethod />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/medicines-orders"
            element={
              <ProtectedRoute>
                <MyMedOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/medicines-orders-details"
            element={
              <ProtectedRoute>
                <MyMedOrdersDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/doctor-consults"
            element={
              <ProtectedRoute>
                <MyDocConsultation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/doctor-consults-details"
            element={
              <ProtectedRoute>
                <MyDocConsultationDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/lab-tests"
            element={
              <ProtectedRoute>
                <MyLabTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/package-tests"
            element={
              <ProtectedRoute>
                <MyPackageTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/wish-list"
            element={
              <ProtectedRoute>
                <MyWishList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/offers"
            element={
              <ProtectedRoute>
                <Offers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/delivery-address"
            element={
              <ProtectedRoute>
                <MyAddress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/my-notifications"
            element={
              <ProtectedRoute>
                <MyNotifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/lab-test-details"
            element={
              <ProtectedRoute>
                <LabTestDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/package-test-details"
            element={
              <ProtectedRoute>
                <MyPackageDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/doctors" element={<Doctors />}></Route>
          <Route
            path="/doctors/profile/:doctorName"
            element={<DoctorProfile />}
          ></Route>
          <Route
            path="/doctors/profile/:doctorId/appointment"
            element={
              <ProtectedRoute>
                <DoctorAppointment />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/doctors/:specialityName" element={<DoctorListing />} />
          <Route path="/pharmacy" element={<Pharmacy />}></Route>
          <Route
            path="/pharmacy/category/:category"
            element={<MedicinesList />}
          />
           <Route
            path="/pharmacy/brands"
            element={<Brands/>}
          />
          <Route
            path="/pharmacy/brand/:brand"
            element={<MedicinesBrandList />}
          />
          <Route
            path="/pharmacy/product/:product"
            element={<MedicineDetails />}
          />
          {/* Wellness */}
          <Route path="/wellness" element={<Wellness />}></Route>
          <Route
            path="/wellness/exploring-transgender-experiences"
            element={<Transgender />}
          ></Route>
          <Route
            path="/wellness/aids-compressive-guide"
            element={<AidsCompressiveGuide />}
          ></Route>
          <Route
            path="/wellness/empower-health"
            element={<EmpowerHealth />}
          ></Route>
          <Route path="/prep-pep" element={<PrepPep />}></Route>
          <Route path="/hiv-art" element={<HivArt />}></Route>
          <Route path="/hrt" element={<Hrt />}></Route>
          <Route path="/cancellation-refund" element={<Refund />}></Route>
          <Route path="/policies" element={<Policies />}></Route>
          <Route path="/terms-of-use" element={<Terms />}></Route>
          <Route path="/shipping-policy" element={<Shipping />}></Route>
          <Route path="/become-consultant" element={<Signup />}></Route>
          {/* Auth */}
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/forgot-password" element={<ForgotPwd />}></Route>
          {/* <Route path="/otp-verify" element={<OtpVerify />}></Route> */}
          <Route path="/reset-password" element={<ResetPassword />}></Route>
          {/* Cart */}
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/success" element={<Success />}></Route>
          <Route path="/error" element={<Error />}></Route>
          {/* pathology */}
          <Route path="/pathology" element={<Pathology />}></Route>
          <Route path="/pathology/lab-test" element={<Labtest />}></Route>
          <Route
            path="/pathology/lab-test/:healthConcern/:healthConcernId"
            element={<HealthConcernLabTest />}
          ></Route>
          <Route
            path="pathology/lab-test/cart"
            element={<LabTestCart />}
          ></Route>
          <Route
            path="pathology/lab-test/book"
            element={ <ProtectedRoute><LabTestBook /></ProtectedRoute> }
          ></Route>
          <Route
            path="pathology/lab-test/confirmBook"
            element={<ProtectedRoute><LabTestConfirm /></ProtectedRoute>}
          ></Route>
          <Route path="/pathology/packages" element={<Packages />}></Route>
          <Route
            path="/pathology/packages/:healthConcern/:healthConcernId"
            element={<HealthConcernPackage />}
          ></Route>
          <Route
            path="/pathology/packages/details/:packagename"
            element={<PackageDetails />}
          ></Route>
          <Route
            path="/pathology/packages/book/:packagename"
            element={
              <ProtectedRoute>
                <PackageBooking />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/pathology/packages/confirmBook/:packagename"
            element={
              <ProtectedRoute>
                <PackageBookingConfirm />
              </ProtectedRoute>
            }
          ></Route>
          {/* <Route path="/jwt" element={<JwtToken/>} ></Route>*/}
          <Route path="/phone" element={<PhoneAuth />}></Route>{" "}
          <Route path="/enquiry" element={<Enquiry/>}></Route>{" "}
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default Routing;
