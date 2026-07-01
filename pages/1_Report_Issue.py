import streamlit as st
import sys
import uuid
from pathlib import Path

# Ensure project root is on the path when running as a multipage app
_PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))

from utils.gemini import GeminiAnalysisError, analyze_image
from utils.storage import save_report

UPLOADS_DIR = _PROJECT_ROOT / "uploads"
st.set_page_config(
    page_title="Report Issue · Community Hero",
    page_icon="📋",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ── Shared styles (matches app.py) ────────────────────────────────────────────
st.markdown(
    """
    <style>
        #MainMenu, footer { visibility: hidden; }
        .block-container {
            padding-top: 2rem;
            padding-bottom: 4rem;
            max-width: 900px;
        }

        .page-hero {
            text-align: center;
            padding: 2.5rem 1.5rem 2rem;
            margin-bottom: 2rem;
            border-radius: 20px;
            background: linear-gradient(135deg, #0f766e 0%, #14b8a6 45%, #2dd4bf 100%);
            color: #ffffff;
            box-shadow: 0 12px 40px rgba(15, 118, 110, 0.25);
        }
        .page-hero-badge {
            display: inline-block;
            font-size: 0.8rem;
            font-weight: 600;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            background: rgba(255, 255, 255, 0.18);
            border: 1px solid rgba(255, 255, 255, 0.35);
            border-radius: 999px;
            padding: 0.3rem 0.85rem;
            margin-bottom: 1rem;
        }
        .page-hero-title {
            font-size: clamp(1.75rem, 4vw, 2.5rem);
            font-weight: 800;
            margin: 0 0 0.5rem 0;
            letter-spacing: -0.02em;
        }
        .page-hero-sub {
            font-size: 1rem;
            opacity: 0.92;
            margin: 0;
            line-height: 1.6;
        }

        .form-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 2rem 2rem 1.5rem;
            box-shadow: 0 4px 18px rgba(15, 23, 42, 0.06);
            margin-bottom: 1.5rem;
        }
        .form-section-label {
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #0f766e;
            margin: 1.5rem 0 0.75rem 0;
        }
        .form-section-label:first-child {
            margin-top: 0;
        }
        .form-hint {
            font-size: 0.875rem;
            color: #64748b;
            margin: -0.25rem 0 0.75rem 0;
        }

        /* Streamlit widget polish */
        div[data-testid="stFileUploader"] section {
            border: 2px dashed #99f6e4 !important;
            border-radius: 12px !important;
            background: #f0fdfa !important;
        }
        div[data-testid="stTextArea"] textarea,
        div[data-testid="stNumberInput"] input {
            border-radius: 10px !important;
        }
        div[data-testid="stSelectbox"] > div > div {
            border-radius: 10px !important;
        }

        /* Primary submit button */
        div[data-testid="stButton"] > button[kind="primary"] {
            background: linear-gradient(135deg, #0f766e, #14b8a6) !important;
            border: none !important;
            border-radius: 12px !important;
            padding: 0.7rem 1.5rem !important;
            font-weight: 600 !important;
            width: 100%;
            transition: opacity 0.2s ease;
        }
        div[data-testid="stButton"] > button[kind="primary"]:hover {
            opacity: 0.92;
        }

        .preview-wrap {
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            margin-top: 0.5rem;
        }
                .ai-results {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 1.5rem 1.75rem;
            box-shadow: 0 4px 18px rgba(15, 23, 42, 0.06);
            margin-top: 1.25rem;
        }
        .ai-results-title {
            font-size: 1.05rem;
            font-weight: 700;
            color: #0f766e;
            margin: 0 0 1.25rem 0;
        }
        .ai-field-label {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #64748b;
            margin: 1rem 0 0.35rem 0;
        }
        .ai-field-label:first-of-type {
            margin-top: 0;
        }
        .ai-field-value {
            font-size: 1rem;
            color: #0f172a;
            line-height: 1.6;
            margin: 0;
        }
        .severity-high   { color: #b91c1c; font-weight: 700; }
        .severity-medium { color: #c2410c; font-weight: 700; }
        .severity-low    { color: #15803d; font-weight: 700; }
        
        @media (max-width: 768px) {
            .form-card { padding: 1.25rem; }
            .page-hero { padding: 2rem 1rem 1.5rem; }
        }
    </style>
    """,
    unsafe_allow_html=True,
)

# ── Page header ─────────────────────────────────────────────────────────────
st.markdown(
    """
    <div class="page-hero">
        <div class="page-hero-badge">📋 New Report</div>
        <h1 class="page-hero-title">Report an Issue</h1>
        <p class="page-hero-sub">
            Help your community by reporting a local problem. Add a photo,
            describe what you see, and pin the location on the map.
        </p>
    </div>
    """,
    unsafe_allow_html=True,
)

# ── Report form (UI only) ─────────────────────────────────────────────────────
with st.container():
    st.markdown('<div class="form-card">', unsafe_allow_html=True)

    # Photo upload
    st.markdown('<p class="form-section-label">📷 Photo Evidence</p>', unsafe_allow_html=True)
    st.markdown(
        '<p class="form-hint">Upload a clear image of the issue (optional but helpful).</p>',
        unsafe_allow_html=True,
    )
    uploaded_image = st.file_uploader(
        "Upload an image",
        type=["jpg", "jpeg", "png", "webp"],
        label_visibility="collapsed",
    )
    if uploaded_image is not None:
        st.markdown('<div class="preview-wrap">', unsafe_allow_html=True)
        st.image(uploaded_image, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)

# Description
    st.markdown('<p class="form-section-label">✏️ Description</p>', unsafe_allow_html=True)
    st.markdown(
        '<p class="form-hint">Tell us more about the problem (optional).</p>',
        unsafe_allow_html=True,
    )
    description = st.text_area(
        "Issue description",
        placeholder="e.g. Large pothole on the sidewalk near the bus stop, creating a safety hazard for pedestrians.",
        height=120,
        label_visibility="collapsed",
    )

    # Category
    st.markdown('<p class="form-section-label">🏷️ Category</p>', unsafe_allow_html=True)
    st.markdown(
        '<p class="form-hint">Choose a category if you know it (optional).</p>',
        unsafe_allow_html=True,
    )
    category = st.selectbox(
        "Issue category",
        options=[
            "— Select a category (optional) —",
            "Road & Infrastructure",
            "Sanitation & Waste",
            "Water & Drainage",
            "Public Safety",
            "Parks & Green Spaces",
            "Street Lighting",
            "Other",
        ],
        label_visibility="collapsed",
    )

    # Location
    st.markdown('<p class="form-section-label">📍 Location</p>', unsafe_allow_html=True)
    st.markdown(
        '<p class="form-hint">Enter GPS coordinates for where the issue was spotted.</p>',
        unsafe_allow_html=True,
    )
    lat_col, lon_col = st.columns(2)
    with lat_col:
        latitude = st.number_input(
            "Latitude",
            min_value=-90.0,
            max_value=90.0,
            value=None,
            format="%.6f",
            placeholder="e.g. 28.6139",
        )
    with lon_col:
        longitude = st.number_input(
            "Longitude",
            min_value=-180.0,
            max_value=180.0,
            value=None,
            format="%.6f",
            placeholder="e.g. 77.2090",
        )

    st.markdown("</div>", unsafe_allow_html=True)

    # Submit
    st.markdown("<br>", unsafe_allow_html=True)
    submitted = st.button("🚀 Submit Report", type="primary", use_container_width=True)

    if submitted:
        if uploaded_image is None:
            st.error("Please upload an image before submitting.")
        else:
            # Save uploaded image temporarily for Gemini analysis
            UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
            suffix = Path(uploaded_image.name).suffix or ".jpg"
            temp_path = UPLOADS_DIR / f"{uuid.uuid4().hex}{suffix}"
            temp_path.write_bytes(uploaded_image.getbuffer())

            try:
                with st.spinner("🤖 Gemini is analyzing your image..."):
                    result = analyze_image(str(temp_path))

                save_report(
                    {
                        "image_path": str(temp_path),
                        "category": result["category"],
                        "severity": result["severity"],
                        "description": result["description"],
                        "user_description": description or None,
                        "latitude": latitude,
                        "longitude": longitude,
                    }
                )

                severity_class = {
                    "High": "severity-high",
                    "Medium": "severity-medium",
                    "Low": "severity-low",
                }.get(result["severity"], "ai-field-value")

                st.markdown(
                    f"""
                    <div class="ai-results">
                        <p class="ai-results-title">🤖 AI Analysis Results</p>
                        <p class="ai-field-label">Category</p>
                        <p class="ai-field-value">{result["category"]}</p>
                        <p class="ai-field-label">Severity</p>
                        <p class="ai-field-value {severity_class}">{result["severity"]}</p>
                        <p class="ai-field-label">Description</p>
                        <p class="ai-field-value">{result["description"]}</p>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )
            except GeminiAnalysisError as exc:
                st.error(f"Gemini analysis failed: {exc}")
            except Exception as exc:
                st.error(f"Unexpected error: {exc}")