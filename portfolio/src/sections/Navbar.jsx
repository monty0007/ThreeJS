import React from 'react'
import { useState } from 'react'
import { navLinks } from '../constants/index.js'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const NavItems = ({ onClick }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavClick = (e, href) => {
        e.preventDefault();
        if (onClick) onClick();

        if (href.startsWith('#')) {
            if (location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                    const element = document.querySelector(href);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                const element = document.querySelector(href);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate(href);
        }
    }

    return (
        <ul className='nav-ul'>
            {navLinks.map(({ id, href, name }) => (
                <li key={id} className='nav-li'>
                    <a
                        href={href}
                        className='nav-li_a'
                        onClick={(e) => handleNavClick(e, href)}
                    >
                        {name}
                    </a>
                </li>
            ))}
        </ul>
    )
}

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen((prevIsOpen) => !prevIsOpen)
    }

    const handleNameClick = (e) => {
        e.preventDefault();
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <header className=' fixed top-0 left-0 right-0 z-50 bg-black/90'>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center py-5 mx-auto c-space">
                    <a href="/" onClick={handleNameClick} className='text-neutral-400 font-bold text-xl hover:text-white transition-colors'>Manish Yadav</a>

                    <button onClick={toggleMenu} className='text-neutral-400 hover:text-white focus:outline-none sm:hidden flex' aria-label='Toggle menu'>
                        {isOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                    <nav className='sm:flex hidden'>
                        <NavItems />
                    </nav>
                </div>
            </div>

            <div className={`nav-sidebar ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <nav className='p-5'>
                    <NavItems onClick={() => setIsOpen(false)} />
                </nav>
            </div>
        </header>
    )
}

export default Navbar