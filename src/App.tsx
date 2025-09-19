import { useState } from 'react'
import './App.css'

type User = {
  name: string
  email: string
}

type Operation = {
  name: string
  description: string
  href: string
}

const demoUser: User = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
}

const operations: Operation[] = [
  {
    name: 'Picker',
    description: 'Select and coordinate resources for upcoming deployments.',
    href: '#picker',
  },
  {
    name: 'Dummy Template',
    description: 'Spin up a sandbox template to prototype new workflows quickly.',
    href: '#dummy-template',
  },
  {
    name: 'Reports',
    description: 'Review usage trends and export insights for stakeholders.',
    href: '#reports',
  },
]

function App() {
  const [user, setUser] = useState<User | null>(demoUser)

  const handleLogout = () => {
    setUser(null)
  }

  const handleLogin = () => {
    setUser(demoUser)
  }

  const greetingName = user?.name.split(' ')[0] ?? 'there'

  return (
    <div className="app-shell d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
        <div className="container py-2">
          <span className="navbar-brand fw-semibold">Warehouse Panel</span>
          <div className="ms-auto d-flex align-items-center gap-3">
            {user ? (
              <>
                <div className="text-white small text-end">
                  <div className="fw-semibold">{user.name}</div>
                  <div className="opacity-75">{user.email}</div>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-outline-light btn-sm"
                onClick={handleLogin}
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow-1 py-5">
        <div className="container">
          {user ? (
            <>
              <header className="mb-4">
                <h1 className="h2 mb-1 text-dark">Welcome back, {greetingName}!</h1>
                <p className="text-muted mb-0">
                  Choose an operation below to manage your workspace.
                </p>
              </header>

              <div className="row g-4">
                {operations.map((operation) => (
                  <div className="col-12 col-md-6 col-xl-4" key={operation.name}>
                    <div className="card card-operation h-100">
                      <div className="card-body d-flex flex-column">
                        <h2 className="h5 mb-2 text-dark">{operation.name}</h2>
                        <p className="text-muted flex-grow-1">{operation.description}</p>
                        <a
                          className="btn btn-success mt-3 align-self-start"
                          href={operation.href}
                        >
                          Open {operation.name}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <h2 className="h4 mb-3 text-dark">You are signed out</h2>
              <p className="text-muted">
                Sign back in to access administrative operations and tools.
              </p>
              <button type="button" className="btn btn-success" onClick={handleLogin}>
                Sign in again
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
