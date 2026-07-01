from utils.storage import load_reports, get_report_stats
from datetime import datetime
import streamlit as st

st.set_page_config(
    page_title="Dashboard · Community Hero",
    page_icon="📊",
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

        .stat-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 1.5rem 1.25rem;
            box-shadow: 0 4px 18px rgba(15, 23, 42, 0.06);
            height: 100%;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .stat-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 28px rgba(15, 118, 110, 0.12);
        }
        .stat-icon {
            font-size: 1.75rem;
            margin-bottom: 0.5rem;
        }
        .stat-value {
            font-size: 2rem;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.1;
            margin-bottom: 0.25rem;
        }
        .stat-label {
            font-size: 0.875rem;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }
        .stat-trend {
            font-size: 0.8rem;
            color: #0f766e;
            margin-top: 0.5rem;
            font-weight: 500;
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

        .reports-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
        }
        .reports-table th {
            text-align: left;
            padding: 0.75rem 1rem;
            background: #f0fdfa;
            color: #0f766e;
            font-weight: 700;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 2px solid #99f6e4;
        }
        .reports-table td {
            padding: 0.85rem 1rem;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
            vertical-align: middle;
        }
        .reports-table tr:last-child td {
            border-bottom: none;
        }
        .reports-table tr:hover td {
            background: #f8fafc;
        }
        .img-cell {
            font-size: 1.5rem;
            text-align: center;
            width: 60px;
        }

        .badge {
            display: inline-block;
            padding: 0.2rem 0.65rem;
            border-radius: 999px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .badge-critical { background: #fee2e2; color: #b91c1c; }
        .badge-high     { background: #ffedd5; color: #c2410c; }
        .badge-medium   { background: #fef9c3; color: #a16207; }
        .badge-low      { background: #dcfce7; color: #15803d; }
        .badge-open     { background: #dbeafe; color: #1d4ed8; }
        .badge-progress { background: #ede9fe; color: #6d28d9; }
        .badge-resolved { background: #d1fae5; color: #047857; }

        .map-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 280px;
            border: 2px dashed #99f6e4;
            border-radius: 14px;
            background: linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%);
            color: #64748b;
            text-align: center;
            padding: 2rem;
        }
        .map-placeholder-icon {
            font-size: 3rem;
            margin-bottom: 0.75rem;
        }
        .map-placeholder-title {
            font-size: 1.15rem;
            font-weight: 700;
            color: #0f766e;
            margin-bottom: 0.35rem;
        }
        .map-placeholder-text {
            font-size: 0.9rem;
            color: #64748b;
        }

        .timeline {
            position: relative;
            padding-left: 1.5rem;
            border-left: 2px solid #99f6e4;
        }
        .timeline-item {
            position: relative;
            padding-bottom: 1.25rem;
        }
        .timeline-item:last-child {
            padding-bottom: 0;
        }
        .timeline-dot {
            position: absolute;
            left: -1.85rem;
            top: 0.15rem;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #14b8a6;
            border: 2px solid #ffffff;
            box-shadow: 0 0 0 2px #99f6e4;
        }
        .timeline-time {
            font-size: 0.75rem;
            color: #94a3b8;
            font-weight: 500;
            margin-bottom: 0.2rem;
        }
        .timeline-text {
            font-size: 0.9rem;
            color: #334155;
            line-height: 1.5;
            margin: 0;
        }
        .timeline-text strong {
            color: #0f172a;
        }

        @media (max-width: 768px) {
            .page-hero { padding: 2rem 1rem 1.5rem; }
            .stat-value { font-size: 1.5rem; }
        }
    </style>
    """,
    unsafe_allow_html=True,
)

# ── Page header ───────────────────────────────────────────────────────────────
st.markdown(
    """
    <div class="page-hero">
        <div class="page-hero-badge">📊 Community Overview</div>
        <h1 class="page-hero-title">Dashboard</h1>
        <p class="page-hero-sub">
            Monitor neighborhood reports, track critical issues, and stay on top
            of community activity — all in one place.
        </p>
    </div>
    """,
    unsafe_allow_html=True,
)

# ── Statistics cards ──────────────────────────────────────────────────────────
stats_data = get_report_stats()
all_reports = load_reports()
latest = sorted(all_reports, key=lambda r: r["timestamp"], reverse=True)[:10]

stats = [
    ("📋", str(stats_data["total_reports"]), "Total Reports", "Live data"),
    ("🚨", str(stats_data["critical_count"]), "Critical Issues", "From AI severity"),
    ("📊", str(len(stats_data["category_counts"])), "Categories", "Auto-detected"),
    ("⚡", "Active", "System Status", "Real-time"),
]

cols = st.columns(4, gap="medium")
for col, (icon, value, label, trend) in zip(cols, stats):
    with col:
        st.markdown(
            f"""
            <div class="stat-card">
                <div class="stat-icon">{icon}</div>
                <div class="stat-value">{value}</div>
                <div class="stat-label">{label}</div>
                <div class="stat-trend">{trend}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

st.markdown("<br>", unsafe_allow_html=True)

# ── Recent reports table + Map ────────────────────────────────────────────────
left_col, right_col = st.columns([1.4, 1], gap="large")

with left_col:
    if latest:
        rows_html = "".join(
            f"""<tr>
                <td class="img-cell">📷</td>
                <td>{r['category']}</td>
                <td><span class="badge badge-{r['severity'].lower()}">{r['severity']}</span></td>
                <td><span class="badge badge-open">Open</span></td>
                <td>{r['timestamp'][:10]}</td>
            </tr>"""
            for r in latest
        )
    else:
        rows_html = (
            '<tr><td colspan="5" style="text-align:center; '
            'color:#94a3b8; padding:1.5rem;">No reports yet</td></tr>'
        )

    st.markdown(
        f"""
        <div class="panel-card">
            <p class="panel-title">📋 Recent Reports</p>
            <p class="panel-sub">Latest issues submitted by the community</p>
            <table class="reports-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Category</th>
                        <th>Severity</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {rows_html}
                </tbody>
            </table>
        </div>
        """,
        unsafe_allow_html=True,
    )

with right_col:
    st.markdown(
        """
        <div class="panel-card">
            <p class="panel-title">🗺️ Issue Map</p>
            <p class="panel-sub">Geographic view of reported problems</p>
            <div class="map-placeholder">
                <div class="map-placeholder-icon">📍</div>
                <div class="map-placeholder-title">Interactive Map Coming Soon</div>
                <div class="map-placeholder-text">
                    Report locations will appear here once map integration is enabled.
                </div>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

# ── Activity timeline ─────────────────────────────────────────────────────────
st.markdown(
    """
    <div class="panel-card">
        <p class="panel-title">🕐 Recent Activity</p>
        <p class="panel-sub">Live feed of community actions and updates</p>
        <div class="timeline">
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-time">2 minutes ago</div>
                <p class="timeline-text">
                    <strong>🚨 New critical report</strong> — Pothole on Main St.
                    flagged as <em>Road & Infrastructure</em>.
                </p>
            </div>
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-time">18 minutes ago</div>
                <p class="timeline-text">
                    <strong>✅ Issue resolved</strong> — Broken streetlight on Oak Ave
                    marked complete by the maintenance team.
                </p>
            </div>
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-time">1 hour ago</div>
                <p class="timeline-text">
                    <strong>👤 New volunteer joined</strong> — Priya S. signed up to
                    help with neighborhood cleanups.
                </p>
            </div>
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-time">3 hours ago</div>
                <p class="timeline-text">
                    <strong>🔄 Status updated</strong> — Overflowing bin report moved
                    to <em>In Progress</em>.
                </p>
            </div>
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-time">Yesterday</div>
                <p class="timeline-text">
                    <strong>📋 New report submitted</strong> — Waterlogging near
                    Central Park reported by a resident.
                </p>
            </div>
        </div>
    </div>
    """,
    unsafe_allow_html=True,
)

st.markdown("<br>", unsafe_allow_html=True)
st.caption("Community Hero · Dashboard · Live data from submitted reports")