import React, { useEffect, useState, useRef } from 'react'

export default function App() {
  const [prs, setPrs] = useState([])
  const [stats, setStats] = useState({})
  const chartRef = useRef(null)

  useEffect(() => {
    fetch('/api/prs')
      .then(r => r.json())
      .then(setPrs)

    fetch('/api/prs/stats')
      .then(r => r.json())
      .then(setStats)
  }, [])

  useEffect(() => {
    if (!window.Chart || !prs.length) return

    const ctx = chartRef.current.getContext('2d')
    const labels = prs.slice(0, 10).map(pr => `PR #${pr.prNumber}`)
    const data = prs.slice(0, 10).map(pr => parseFloat((pr.totalSavedBytes || 0) / 1024 / 1024))

    if (window.currentChart) {
      window.currentChart.destroy()
    }

    window.Chart.defaults.color = '#94a3b8';
    window.Chart.defaults.font.family = "'Outfit', sans-serif";

    window.currentChart = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.reverse(),
        datasets: [
          {
            label: 'Space Saved (MB)',
            data: data.reverse(),
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#10b981',
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 17, 26, 0.9)',
            titleColor: '#f8fafc',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return context.parsed.y.toFixed(2) + ' MB Saved';
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255,255,255,0.05)',
              drawBorder: false
            }
          },
          y: {
            grid: {
              color: 'rgba(255,255,255,0.05)',
              drawBorder: false
            },
            beginAtZero: true
          }
        }
      }
    })
  }, [prs])

  return (
    <div className="container">
      <h1 className="header-title">
        Media Optimization Dashboard
      </h1>

      <div className="grid-stats">
        <div className="stat-card">
          <div className="stat-label">Total PRs</div>
          <div className="stat-value">{Number(stats.totalPRs || 0)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Space Saved</div>
          <div className="stat-value">{Number((stats.totalSavedBytes || 0) / 1024 / 1024).toFixed(2)} <span style={{fontSize: '1.25rem', color: 'var(--text-muted)'}}>MB</span></div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Last Run</div>
          <div className="stat-value" style={{fontSize: '1.5rem', marginTop: '0.5rem'}}>
            {stats.lastRun ? new Date(stats.lastRun).toLocaleString() : 'N/A'}
          </div>
        </div>
      </div>

      <div className="section-card">
        <h2 className="section-title">Compression Trend</h2>
        <div className="chart-container">
          <canvas ref={chartRef} />
        </div>
      </div>

      <div className="section-card">
        <h2 className="section-title">Recent PR Activity</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>PR</th>
                <th>Branch</th>
                <th>Status</th>
                <th>Saved MB</th>
                <th>Files</th>
              </tr>
            </thead>
            <tbody>
              {prs.map(p => (
                <tr key={p._id}>
                  <td>
                    <span className="pr-link">#{p.prNumber}</span>
                  </td>
                  <td>{p.branch}</td>
                  <td>
                    <span className={`status-badge ${p.status === 'completed' ? 'status-completed' : (p.status === 'pending' ? 'status-pending' : 'status-default')}`}>
                      {p.status || 'unknown'}
                    </span>
                  </td>
                  <td>{Number((p.totalSavedBytes || 0) / 1024 / 1024).toFixed(2)}</td>
                  <td>{(p.optimizedFiles || []).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}