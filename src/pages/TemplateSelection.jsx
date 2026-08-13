import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaCheckCircle,
  FaArrowRight
} from "react-icons/fa";
import api from "../service/api";

import modern from "../assets/templates/Blue.jpeg";
import professional from "../assets/templates/Green.jpeg";
import creative from "../assets/templates/Orange.jpeg";
import minimal from "../assets/templates/Grey.jpeg";

import "./TemplateSelection.css";

function TemplateSelection() {

  const navigate = useNavigate();

 const chooseTemplate = (template) => {

    localStorage.setItem("template", template);

    navigate("/resume");

};

    

  return (

<div className="template-page">

<div className="template-container">

<div className="text-center mb-5">

<h1 className="template-title">

Choose Your Resume Template

</h1>

<p className="template-subtitle">

Pick the best design for your professional resume.

</p>

</div>

<div className="progress mb-5">

<div
className="progress-bar bg-primary"
style={{width:"100%"}}
>

Step 8 of 8

</div>

</div>

<div className="row g-4">

{/* Modern */}

<div className="col-lg-3 col-md-6">

<div className="template-card">

<div className="badge-modern">

Most Popular

</div>

<img

src={modern}

alt="Modern"

className="template-image"

/>

<div className="template-body">

<h4>

Modern

</h4>

<div className="rating">

<FaStar/>

<FaStar/>

<FaStar/>

<FaStar/>

<FaStar/>

</div>

<p>

Perfect for Freshers, Developers and IT Professionals.

</p>

<div className="template-tags">

<span>

ATS Friendly

</span>

<span>

1 Page

</span>

</div>

<button

className="btn modern-btn"

onClick={()=>

chooseTemplate("Modern")

}

>

Use Template

<FaArrowRight className="ms-2"/>

</button>

</div>

</div>

</div>

{/* Professional */}

<div className="col-lg-3 col-md-6">

<div className="template-card">

<div className="badge-professional">

Recruiter's Choice

</div>

<img

src={professional}

alt="Professional"

className="template-image"

/>

<div className="template-body">

<h4>

Professional

</h4>

<div className="rating">

<FaStar/>

<FaStar/>

<FaStar/>

<FaStar/>

<FaStar/>

</div>

<p>

Ideal for experienced professionals and corporate jobs.

</p>

<div className="template-tags">

<span>

Corporate

</span>

<span>

ATS

</span>

</div>

<button

className="btn professional-btn"

onClick={()=>

chooseTemplate("Professional")

}

>

Use Template

<FaArrowRight className="ms-2"/>

</button>

</div>

</div>

</div>
{/* Creative */}

<div className="col-lg-3 col-md-6">

<div className="template-card">

<div className="badge-creative">

Designer

</div>

<img

src={creative}

alt="Creative"

className="template-image"

/>

<div className="template-body">

<h4>

Creative

</h4>

<div className="rating">

<FaStar/>

<FaStar/>

<FaStar/>

<FaStar/>

<FaStar/>

</div>

<p>

Perfect for UI/UX Designers, Graphic Designers and Creative Professionals.

</p>

<div className="template-tags">

<span>

Creative

</span>

<span>

Portfolio

</span>

</div>

<button

className="btn creative-btn"

onClick={()=>

chooseTemplate("Creative")

}

>

Use Template

<FaArrowRight className="ms-2"/>

</button>

</div>

</div>

</div>

{/* Minimal */}

<div className="col-lg-3 col-md-6">

<div className="template-card">

<div className="badge-minimal">

Simple

</div>

<img

src={minimal}

alt="Minimal"

className="template-image"

/>

<div className="template-body">

<h4>

Minimal

</h4>

<div className="rating">

<FaStar/>

<FaStar/>

<FaStar/>

<FaStar/>

<FaStar/>

</div>

<p>

Clean and elegant resume focused on readability.

</p>

<div className="template-tags">

<span>

Minimal

</span>

<span>

Simple

</span>

</div>

<button

className="btn minimal-btn"

onClick={()=>

chooseTemplate("Minimal")

}

>

Use Template

<FaArrowRight className="ms-2"/>

</button>

</div>

</div>

</div>

</div>

{/* Bottom Section */}

<div className="template-footer mt-5">

<div className="row align-items-center">

<div className="col-md-8">

<h4>

<FaCheckCircle className="me-2 text-success"/>

All Templates are ATS Friendly

</h4>

<p>

Every template is designed to be professional,
print-ready, mobile-friendly, and optimized for
Applicant Tracking Systems (ATS).

</p>

</div>

<div className="col-md-4 text-end">

<button
className="btn btn-secondary me-2"
onClick={() => navigate("/languages")}
>

Back

</button>

<button
className="btn btn-primary"
onClick={() => chooseTemplate("Modern")}
>

Continue

</button>

</div>

</div>

</div>

</div>

</div>

  );

}

export default TemplateSelection;