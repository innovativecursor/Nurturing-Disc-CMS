import React, { useEffect } from "react";
import Login from "../Login/Login";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
} from "react-router-dom";
import Home from "../Home/Home";
import { connect } from "react-redux";
import PrivateRoute from "./PrivateRoute";
import SideDrawer from "../Drawer/SideDrawer";
import { matchRoutes, useLocation } from "react-router-dom";
import Navbar from "../NavigationBar/Navbar";
import ProductTable from "../ProductTable/ProductTable";
import Robots from "../Robots/Robots";
import ResetPassword from "../resetPassword/ResetPassword";
import Inquiries from "../Inquiries/Inquiries";
import CreateTestimonials from "../testimonials/CreateTestimonials";
import DeleteTestimonials from "../DeleteTestimonials/DeleteTestimonials";
import Gallery from "../Gallery/Gallery";
import CreateEvents from "../CreateEvents/CreateEvents";
import UpdateEvents from "../UpdateEvents/UpdateEvents";
import DeleteEvents from "../DeleteEvents/DeleteEvents";
import AddStaff from "../AddStaff/AddStaff";
import DeleteStaff from "../DeleteStaff/DeleteStaff";
import AddBlogs from "../AddBlogs/AddBlogs";
import DeleteBlogs from "../DeleteBlogs/DeleteBlogs";
import UpdateBlogs from "../UpdateBlogs/UpdateBlogs";
import Enrollments from "../Enrollments/Enrollments";
import CreatePrograms from "../CreatePrograms/CreatePrograms";
import UpdatePrograms from "../UpdatePrograms/UpdatePrograms";
import DeletePrograms from "../DeletePrograms/DeletePrograms";

function Navigation(props) {
  const location = useLocation();
  const navigateTo = useNavigate();
  useEffect(() => {
    if (location.pathname === "/") {
      window.localStorage.clear();
      localStorage.removeItem("access_token");
      navigateTo("/");
      props.loggedOut();
    }
  }, [location.pathname]);

  return (
    <>
      <div>
        {location.pathname !== "/" && props.loggedIn ? (
          <div className="">
            <Navbar />
            <SideDrawer />
          </div>
        ) : (
          ""
        )}

        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/reset/:token" element={<ResetPassword />} />
            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/inquiries" element={<Inquiries />} />
              <Route path="/enrollments" element={<Enrollments />} />
              <Route
                path="/createTestimonials"
                element={<CreateTestimonials />}
              />
              <Route
                path="/deleteTestimonials"
                element={<ProductTable pageMode="Delete" type="Testimonials" />}
              />
              <Route
                path="/deleteTestimonialsinner"
                element={<DeleteTestimonials />}
              />
              <Route path="/createStaff" element={<AddStaff />} />
              <Route
                path="/deleteStaff"
                element={<ProductTable pageMode="Delete" type="Staff" />}
              />
              <Route path="/deleteStaffinner" element={<DeleteStaff />} />

              <Route
                path="/gallery"
                element={<Gallery pageMode="Update" type="Gallery" />}
              />
              <Route path="/createEvents" element={<CreateEvents />} />
              <Route
                path="/updateEvents"
                element={<ProductTable pageMode="Update" type="Events" />}
              />
              <Route path="/updateEventsinner" element={<UpdateEvents />} />
              <Route
                path="/deleteEvents"
                element={<ProductTable pageMode="Delete" type="Events" />}
              />
              <Route path="/deleteEventsinner" element={<DeleteEvents />} />

              <Route path="/createBlogs" element={<AddBlogs />} />
              <Route
                path="/updateBlogs"
                pageMode="Update"
                element={<ProductTable pageMode="Update" type="Blogs" />}
              />
              <Route
                path="/updateBlogsinner"
                pageMode="Update"
                element={<UpdateBlogs />}
              />
              <Route
                path="/deleteBlogs"
                pageMode="Delete"
                element={<ProductTable pageMode="Delete" type="Blogs" />}
              />
              <Route
                path="/deleteBlogsinner"
                pageMode="Delete"
                element={<DeleteBlogs />}
              />
              <Route path="/createPrograms" element={<CreatePrograms />} />
              <Route
                path="/updatePrograms"
                element={<ProductTable pageMode="Update" type="Programs" />}
              />
              <Route path="/updatePrograminner" element={<UpdatePrograms />} />
              <Route
                path="/deletePrograms"
                element={<ProductTable pageMode="Delete" type="Programs" />}
              />
              <Route path="/deletePrograminner" element={<DeletePrograms />} />
            </Route>
            <Route path="*" element={<Robots />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    loggedOut: () => dispatch({ type: "LOGGEDOUT" }),
  };
};
const mapStateToProps = (state) => {
  return {
    loggedIn: state?.universalReducer?.isLoggedIn,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
