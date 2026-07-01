import streamlit as st

st.set_page_config(
    page_title="Community Hero",
    page_icon="🏘️",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ── Inline styles ─────────────────────────────────────────────────────────────
st.markdown(
    """
    <style>
        /* Hide default Streamlit chrome for a cleaner landing feel */
        #MainMenu, footer, header { visibility: hidden; }
        .block-container {
            padding-top: 2rem;
            padding-bottom: 4rem;
            max-width: 1100px;
        }

        /* Hero */
        .hero-wrap {
            text-align: center;
            padding: 3.5rem 1.5rem 2.5rem;
            margin-bottom: 2rem;
            border-radius: 20px;
            background: linear-gradient(135deg, #0f766e 0%, #14b8a6 45%, #2dd4bf 100%);
            color: #ffffff;
            box-shadow: 0 12px 40px rgba(15, 118, 110, 0.25);
        }
        .hero-badge {
            display: inline-block;
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            background: rgba(255, 255, 255, 0.18);
            border: 1px solid rgba(255, 255, 255, 0.35);
            border-radius: 999px;
            padding: 0.35rem 0.9rem;
            margin-bottom: 1.25rem;
        }
        .hero-title {
            font-size: clamp(2.4rem, 5vw, 3.75rem);
            font-weight: 800;
            line-height: 1.1;
            margin: 0 0 0.75rem 0;
            letter-spacing: -0.02em;
        }
        .hero-subtitle {
            font-size: clamp(1.1rem, 2.5vw, 1.45rem);
            font-weight: 500;
            opacity: 0.95;
            margin: 0 0 1.25rem 0;
        }
        .hero-desc {
            font-size: 1.05rem;
            line-height: 1.7;
            max-width: 640px;
            margin: 0 auto 2rem;
            opacity: 0.92;
        }

        /* Section headings */
        .section-title {
            text-align: center;
            font-size: 1.6rem;
            font-weight: 700;
            color: #0f172a;
            margin: 2.5rem 0 0.35rem;
        }
        .section-sub {
            text-align: center;
            color: #64748b;
            font-size: 1rem;
            margin-bottom: 1.75rem;
        }

        /* Feature cards */
        .feature-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 1.75rem 1.5rem;
            height: 100%;
            box-shadow: 0 4px 18px rgba(15, 23, 42, 0.06);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .feature-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 28px rgba(15, 118, 110, 0.12);
        }
        .feature-icon {
            font-size: 2.25rem;
            margin-bottom: 0.75rem;
        }
        .feature-title {
            font-size: 1.15rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 0.5rem;
        }
        .feature-text {
            font-size: 0.95rem;
            line-height: 1.6;
            color: #64748b;
            margin: 0;
        }

        /* Style page_link buttons */
        div[data-testid="stPageLink-NavLink"] a {
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 0.75rem 1.25rem !important;
            border-radius: 12px !important;
            font-weight: 600 !important;
            text-decoration: none !important;
            transition: all 0.2s ease;
        }

        /* Primary CTA column */
        div[data-testid="column"]:nth-of-type(1) div[data-testid="stPageLink-NavLink"] a {
            background: #ffffff !important;
            color: #0f766e !important;
            border: 2px solid #ffffff !important;
        }
        div[data-testid="column"]:nth-of-type(1) div[data-testid="stPageLink-NavLink"] a:hover {
            background: #f0fdfa !important;
        }

        /* Secondary CTA column */
        div[data-testid="column"]:nth-of-type(2) div[data-testid="stPageLink-NavLink"] a {
            background: transparent !important;
            color: #ffffff !important;
            border: 2px solid rgba(255, 255, 255, 0.85) !important;
        }
        div[data-testid="column"]:nth-of-type(2) div[data-testid="stPageLink-NavLink"] a:hover {
            background: rgba(255, 255, 255, 0.12) !important;
        }

        @media (max-width: 768px) {
            .hero-wrap { padding: 2.5rem 1rem 2rem; }
            .block-container { padding-top: 1rem; }
        }
    </style>
    """,
    unsafe_allow_html=True,
)

# ── Hero section ──────────────────────────────────────────────────────────────
st.markdown(
    """
    <div class="hero-wrap">
        <div class="hero-badge">🏘️ Hyperlocal · AI-Powered</div>
        <h1 class="hero-title">Community Hero</h1>
        <p class="hero-subtitle">AI-powered Hyperlocal Problem Solver</p>
        <p class="hero-desc">
            Report neighborhood issues in seconds. Community Hero helps residents,
            volunteers, and local teams spot problems, prioritize what matters most,
            and keep the community informed — all in one place.
        </p>
    </div>
    """,
    unsafe_allow_html=True,
)

# CTA buttons (centered, responsive)
btn_col1, btn_col2, btn_col3 = st.columns([1, 2, 1])
with btn_col2:
    c1, c2 = st.columns(2)
    with c1:
        st.page_link("pages/1_Report_Issue.py", label="📋 Report an Issue", use_container_width=True)
    with c2:
        st.page_link("pages/2_Dashboard.py", label="📊 View Dashboard", use_container_width=True)

# ── Features ──────────────────────────────────────────────────────────────────
st.markdown('<p class="section-title">Why Community Hero?</p>', unsafe_allow_html=True)
st.markdown(
    '<p class="section-sub">Smart tools built for real neighborhoods</p>',
    unsafe_allow_html=True,
)

col1, col2, col3 = st.columns(3, gap="large")

with col1:
    st.markdown(
        """
        <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <div class="feature-title">AI Issue Detection</div>
            <p class="feature-text">
                Upload a photo and describe the problem. AI helps classify
                and understand issues faster.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

with col2:
    st.markdown(
        """
        <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <div class="feature-title">Smart Priority Analysis</div>
            <p class="feature-text">
                Surface urgent reports first so teams can respond to what
                needs attention right away.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

with col3:
    st.markdown(
        """
        <div class="feature-card">
            <div class="feature-icon">📍</div>
            <div class="feature-title">Community Dashboard</div>
            <p class="feature-text">
                Track open reports, trends, and neighborhood activity
                from a single shared view.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

# ── Footer note ───────────────────────────────────────────────────────────────
st.markdown("<br>", unsafe_allow_html=True)
st.caption("Built for hackathon demo · No backend connected yet")