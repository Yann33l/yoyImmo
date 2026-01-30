import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MainLayout } from './MainLayout'

describe('MainLayout', () => {
  it('renders children content', () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('shows mobile menu button on mobile', () => {
    render(<MainLayout><div>Content</div></MainLayout>)
    const menuButton = screen.getByRole('button', { name: /open menu/i })
    expect(menuButton).toBeInTheDocument()
  })

  it('toggles mobile sidebar when menu button is clicked', async () => {
    const user = userEvent.setup()
    render(<MainLayout><div>Content</div></MainLayout>)

    const menuButton = screen.getByRole('button', { name: /open menu/i })
    await user.click(menuButton)

    // Sidebar should be visible (transform translateX-0)
    const sidebar = screen.getByRole('navigation')
    expect(sidebar).not.toHaveClass('-translate-x-full')
  })

  it('renders navigation links', () => {
    render(<MainLayout><div>Content</div></MainLayout>)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Properties')).toBeInTheDocument()
    expect(screen.getByText('Tenants')).toBeInTheDocument()
    expect(screen.getByText('Payments')).toBeInTheDocument()
    expect(screen.getByText('Documents')).toBeInTheDocument()
  })
})
