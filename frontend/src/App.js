import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Personal from "./pages/Personal";
import Education from "./pages/Education";
import Experience from "./pages/Experience";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Certifications from "./pages/Certifications";
import Languages from "./pages/Languages";
import TemplateSelection from "./pages/TemplateSelection";
import Preview from "./pages/Preview";
import Resume from "./pages/Resume";
import ForgotPassword from "./pages/ForgotPassword";
import MyResumes from "./pages/MyResumes";
import Analytics from "./pages/Analytics";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/my-resumes"
          element={<MyResumes />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/personal"
          element={<Personal />}
        />

        <Route
          path="/education"
          element={<Education />}
        />

        <Route
          path="/experience"
          element={<Experience />}
        />

        <Route
          path="/skills"
          element={<Skills />}
        />

        <Route
          path="/projects"
          element={<Projects />}
        />

        <Route
          path="/certifications"
          element={<Certifications />}
        />

        <Route
          path="/languages"
          element={<Languages />}
        />

        <Route
          path="/templates"
          element={<TemplateSelection />}
        />

        <Route
          path="/preview"
          element={<Preview />}
        />

        <Route
          path="/resume"
          element={<Resume />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;