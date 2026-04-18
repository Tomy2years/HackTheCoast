import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 lg:px-8">
        <section className="flex flex-1 flex-col items-center justify-center gap-10 text-center">
          <div className="relative flex h-[260px] w-[260px] items-center justify-center rounded-[2rem] bg-white/90 p-4 shadow-2xl shadow-slate-200 dark:bg-slate-900 dark:shadow-slate-950">
            <img src={heroImg} alt="Hero" className="h-40 w-40 rounded-3xl object-cover" />
            <img src={reactLogo} alt="React logo" className="absolute left-8 top-12 h-10 w-10" />
            <img src={viteLogo} alt="Vite logo" className="absolute bottom-8 right-10 h-10 w-10" />
          </div>

          <div className="max-w-2xl space-y-4">
            <h1 className="text-5xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              Get started
            </h1>
            <p className="mx-auto max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
              Edit <code className="rounded bg-slate-200 px-2 py-1 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100">src/App.jsx</code> and save to test{' '}
              <code className="rounded bg-slate-200 px-2 py-1 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100">HMR</code>.
            </p>
          </div>

          <button
            className="rounded-full bg-indigo-600 px-7 py-3 text-base font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => setCount((count) => count + 1)}
          >
            Count is {count}
          </button>
        </section>

        <section className="grid gap-6 border-t border-slate-200 pt-10 text-left dark:border-slate-700 sm:grid-cols-2">
          <div className="rounded-3xl bg-white/80 p-8 shadow-sm shadow-slate-200 dark:bg-slate-900 dark:shadow-slate-950">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100">
              <svg className="h-5 w-5" role="presentation" aria-hidden="true">
                <use href="/icons.svg#documentation-icon" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Documentation</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">Your questions, answered.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://vite.dev/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                <img className="h-4 w-4" src={viteLogo} alt="Vite logo" />
                Explore Vite
              </a>
              <a
                href="https://react.dev/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                <img className="h-4 w-4" src={reactLogo} alt="React logo" />
                Learn more
              </a>
            </div>
          </div>

          <div className="rounded-3xl bg-white/80 p-8 shadow-sm shadow-slate-200 dark:bg-slate-900 dark:shadow-slate-950">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100">
              <svg className="h-5 w-5" role="presentation" aria-hidden="true">
                <use href="/icons.svg#social-icon" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Connect with us</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">Join the Vite community.</p>
            <div className="mt-6 grid gap-3">
              <a
                href="https://github.com/vitejs/vite"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                <svg className="h-5 w-5 text-slate-500 group-hover:text-slate-900 dark:text-slate-300" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#github-icon" />
                </svg>
                GitHub
              </a>
              <a
                href="https://chat.vite.dev/"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                <svg className="h-5 w-5 text-slate-500 group-hover:text-slate-900 dark:text-slate-300" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#discord-icon" />
                </svg>
                Discord
              </a>
              <a
                href="https://x.com/vite_js"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                <svg className="h-5 w-5 text-slate-500 group-hover:text-slate-900 dark:text-slate-300" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#x-icon" />
                </svg>
                X.com
              </a>
              <a
                href="https://bsky.app/profile/vite.dev"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                <svg className="h-5 w-5 text-slate-500 group-hover:text-slate-900 dark:text-slate-300" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#bluesky-icon" />
                </svg>
                Bluesky
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
