import streamlit as st

st.set_page_config(
    page_title="Analytics · Community Hero",
    page_icon="📈",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ── Styles (matches landing page theme) ───────────────────────────────────────
st.markdown(
    """
    <style>
        #MainMenu, footer { visibility: hidden; }
        .block-container {
            padding-top: 2rem;
            padding-bottom: 4rem;
            max-width: 1100px;
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

        .panel-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 1.5rem;
            box-shadow: 0 4px 18px rgba(15, 23, 42, 0.06);
            margin-bottom: 1.5rem;
            height: 100%;
        }
        .panel-title {
            font-size: 1.1rem;
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 0.25rem 0;
        }
        .panel-sub {
            font-size: 0.875rem;
            color: #64748b;
            margin: 0 0 1.25rem 0;
        }

        .insight-card {
            background: linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%);
            border: 1px solid #99f6e4;
            border-radius: 14px;
            padding: 1.25rem;
            height: 100%;
        }
        .insight-icon {
            font-size: 1.75rem;
            margin-bottom: 0.5rem;
        }
        .insight-title {
            font-size: 0.95rem;
            font-weight: 700;
            color: #0f766e;
            margin-bottom: 0.4rem;
        }
        .insight-text {
            font-size: 0.875rem;
            color: #475569;
            line-height: 1.55;
            margin: 0;
        }

        .chart-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 260px;
            border: 2px dashed #cbd5e1;
            border-radius: 14px;
            background: #f8fafc;
            color: #64748b;
            text-align: center;
            padding: 1.5rem;
        }
        .chart-placeholder.tall {
            min-height: 300px;
        }
        .chart-placeholder-icon {
            font-size: 2.5rem;
            margin-bottom: 0.6rem;
            opacity: 0.7;
        }
        .chart-placeholder-title {
            font-size: 1rem;
            font-weight: 700;
            color: #475569;
            margin-bottom: 0.3rem;
        }
        .chart-placeholder-text {
            font-size: 0.85rem;
            color: #94a3b8;
        }

        /* Decorative fake bars (visual only, not a real chart) */
        .fake-bars {
            display: flex;
            align-items: flex-end;
            justify-content: center;
            gap: 10px;
            height: 120px;
            margin-bottom: 1rem;
            opacity: 0.35;
        }
        .fake-bar {
            width: 28px;
            border-radius: 6px 6px 0 0;
            background: linear-gradient(180deg, #14b8a6, #0f766e);
        }

        /* Decorative fake pie (visual only) */
        .fake-pie {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: conic-gradient(
                #0f766e 0deg 120deg,
                #14b8a6 120deg 220deg,
                #99f6e4 220deg 300deg,
                #cbd5e1 300deg 360deg
            );
            margin-bottom: 1rem;
            opacity: 0.4;
        }

        .area-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .area-row:last-child {
            border-bottom: none;
        }
        .area-name {
            font-size: 0.9rem;
            font-weight: 600;
            color: #334155;
        }
        .area-count {
            font-size: 0.8rem;
            font-weight: 700;
            color: #0f766e;
            background: #f0fdfa;
            padding: 0.2rem 0.65rem;
            border-radius: 999px;
        }
        .area-bar-track {
            flex: 1;
            height: 6px;
            background: #e2e8f0;
            border-radius: 999px;
            margin: 0 1rem;
            overflow: hidden;
        }
        .area-bar-fill {
            height: 100%;
            border-radius: 999px;
            background: linear-gradient(90deg, #0f766e, #2dd4bf);
        }

        .rec-item {
            display: flex;
            gap: 0.85rem;
            padding: 0.85rem 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .rec-item:last-child {
            border-bottom: none;
        }
        .rec-icon {
            font-size: 1.35rem;
            flex-shrink: 0;
        }
        .rec-title {
            font-size: 0.9rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 0.2rem;
        }
        .rec-text {
            font-size: 0.85rem;
            color: #64748b;
            line-height: 1.5;
            margin: 0;
        }

        @media (max-width: 768px) {
            .page-hero { padding: 2rem 1rem 1.5rem; }
            .area-bar-track { display: none; }
        }
    </style>
    """,
    unsafe_allow_html=True,
)

# ── Page header ───────────────────────────────────────────────────────────────
st.markdown(
    """
    <div class="page-hero">
        <div class="page-hero-badge">📈 AI-Powered Analytics</div>
        <h1 class="page-hero-title">Analytics</h1>
        <p class="page-hero-sub">
            Discover patterns in community reports, understand severity trends,
            and get AI-driven recommendations to improve your neighborhood.
        </p>
    </div>
    """,
    unsafe_allow_html=True,
)

# ── AI Insights ───────────────────────────────────────────────────────────────
with st.container():
    st.markdown(
        """
        <div class="panel-card" style="margin-bottom: 0.5rem;">
            <p class="panel-title">🤖 AI Insights</p>
            <p class="panel-sub">Smart summaries generated from community report data (placeholder)</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    i1, i2, i3, i4 = st.columns(4, gap="medium")
    insights = [
        ("📈", "Rising Trend", "Road & Infrastructure reports increased 23% compared to last month."),
        ("🚨", "Urgent Alert", "14 critical issues are currently open — highest in the downtown zone."),
        ("⏱️", "Avg. Resolution", "Average time to resolve issues is 4.2 days (placeholder metric)."),
        ("🌟", "Top Contributor", "Sector 7 residents submitted the most reports this week."),
    ]
    for col, (icon, title, text) in zip([i1, i2, i3, i4], insights):
        with col:
            st.markdown(
                f"""
                <div class="insight-card">
                    <div class="insight-icon">{icon}</div>
                    <div class="insight-title">{title}</div>
                    <p class="insight-text">{text}</p>
                </div>
                """,
                unsafe_allow_html=True,
            )

st.markdown("<br>", unsafe_allow_html=True)

# ── Charts row 1: Pie + Severity ──────────────────────────────────────────────
chart_left, chart_right = st.columns(2, gap="large")

with chart_left:
    with st.container():
        st.markdown(
            """
            <div class="panel-card">
                <p class="panel-title">🥧 Issue Category Distribution</p>
                <p class="panel-sub">Breakdown of reports by category</p>
                <div class="chart-placeholder">
                    <div class="fake-pie"></div>
                    <div class="chart-placeholder-title">Pie Chart Placeholder</div>
                    <div class="chart-placeholder-text">
                        Road · Sanitation · Water · Safety · Parks · Other
                    </div>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

with chart_right:
    with st.container():
        st.markdown(
            """
            <div class="panel-card">
                <p class="panel-title">⚡ Severity Distribution</p>
                <p class="panel-sub">How reports are classified by urgency level</p>
                <div class="chart-placeholder">
                    <div class="fake-bars">
                        <div class="fake-bar" style="height: 40%;"></div>
                        <div class="fake-bar" style="height: 70%;"></div>
                        <div class="fake-bar" style="height: 55%;"></div>
                        <div class="fake-bar" style="height: 90%;"></div>
                    </div>
                    <div class="chart-placeholder-title">Bar Chart Placeholder</div>
                    <div class="chart-placeholder-text">
                        Low · Medium · High · Critical
                    </div>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

# ── Monthly reports chart ─────────────────────────────────────────────────────
with st.container():
    st.markdown(
        """
        <div class="panel-card">
            <p class="panel-title">📅 Monthly Reports</p>
            <p class="panel-sub">Report volume over the past 6 months</p>
            <div class="chart-placeholder tall">
                <div class="fake-bars" style="height: 140px; align-items: flex-end;">
                    <div class="fake-bar" style="height: 45%;"></div>
                    <div class="fake-bar" style="height: 60%;"></div>
                    <div class="fake-bar" style="height: 55%;"></div>
                    <div class="fake-bar" style="height: 75%;"></div>
                    <div class="fake-bar" style="height: 65%;"></div>
                    <div class="fake-bar" style="height: 85%;"></div>
                </div>
                <div class="chart-placeholder-title">Line / Bar Chart Placeholder</div>
                <div class="chart-placeholder-text">
                    Jan · Feb · Mar · Apr · May · Jun
                </div>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

# ── Top Problem Areas + AI Recommendations ────────────────────────────────────
bottom_left, bottom_right = st.columns(2, gap="large")

with bottom_left:
    with st.container():
        st.markdown(
            """
            <div class="panel-card">
                <p class="panel-title">📍 Top Problem Areas</p>
                <p class="panel-sub">Neighborhoods with the most reported issues</p>

                <div class="area-row">
                    <span class="area-name">🏙️ Downtown District</span>
                    <div class="area-bar-track"><div class="area-bar-fill" style="width: 92%;"></div></div>
                    <span class="area-count">34 reports</span>
                </div>
                <div class="area-row">
                    <span class="area-name">🏘️ Sector 7</span>
                    <div class="area-bar-track"><div class="area-bar-fill" style="width: 78%;"></div></div>
                    <span class="area-count">28 reports</span>
                </div>
                <div class="area-row">
                    <span class="area-name">🌳 Riverside Park</span>
                    <div class="area-bar-track"><div class="area-bar-fill" style="width: 55%;"></div></div>
                    <span class="area-count">19 reports</span>
                </div>
                <div class="area-row">
                    <span class="area-name">🛣️ Main Street Corridor</span>
                    <div class="area-bar-track"><div class="area-bar-fill" style="width: 48%;"></div></div>
                    <span class="area-count">16 reports</span>
                </div>
                <div class="area-row">
                    <span class="area-name">🏫 School Zone Area</span>
                    <div class="area-bar-track"><div class="area-bar-fill" style="width: 32%;"></div></div>
                    <span class="area-count">11 reports</span>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

with bottom_right:
    with st.container():
        st.markdown(
            """
            <div class="panel-card">
                <p class="panel-title">💡 AI Recommendations</p>
                <p class="panel-sub">Suggested actions based on report patterns (placeholder)</p>

                <div class="rec-item">
                    <div class="rec-icon">🛠️</div>
                    <div>
                        <div class="rec-title">Prioritize road repairs in Downtown</div>
                        <p class="rec-text">
                            34 infrastructure reports cluster on Main St. Consider
                            scheduling a maintenance sweep this week.
                        </p>
                    </div>
                </div>
                <div class="rec-item">
                    <div class="rec-icon">🗑️</div>
                    <div>
                        <div class="rec-title">Increase waste collection in Sector 7</div>
                        <p class="rec-text">
                            Sanitation complaints rose 18%. Extra pickup runs
                            could reduce recurring overflow reports.
                        </p>
                    </div>
                </div>
                <div class="rec-item">
                    <div class="rec-icon">💡</div>
                    <div>
                        <div class="rec-title">Audit street lighting near Riverside</div>
                        <p class="rec-text">
                            Multiple low-severity lighting reports suggest a
                            preventive inspection before issues escalate.
                        </p>
                    </div>
                </div>
                <div class="rec-item">
                    <div class="rec-icon">👥</div>
                    <div>
                        <div class="rec-title">Recruit volunteers for School Zone</div>
                        <p class="rec-text">
                            Safety-related reports near schools may benefit from
                            a community patrol or awareness campaign.
                        </p>
                    </div>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

st.markdown("<br>", unsafe_allow_html=True)
st.caption("Community Hero · Analytics · Hackathon demo · Placeholder data only")