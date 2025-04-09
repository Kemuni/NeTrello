import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfile from '../../components/UserProfile';

jest.mock('next-auth/react', () => ({
  signOut: jest.fn(),
  useSession: () => ({
    data: {
      user: {
        name: 'Тестовый Пользователь'
      }
    }
  })
}));

jest.useFakeTimers();

describe('UserProfile Component', () => {
  test('рендерит аватар пользователя', () => {
    render(<UserProfile />);
    
    const avatar = screen.getByAltText('Profile');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass('w-20 h-20 rounded-full cursor-pointer');
  });

  test('показывает и скрывает меню при клике на аватар', async () => {
    render(<UserProfile />);
    
    const profileButton = screen.getByAltText('Profile');
    expect(screen.queryByText('ВЫЙТИ ИЗ ПРОФИЛЯ')).not.toBeInTheDocument();
    
    fireEvent.click(profileButton);
    
    jest.advanceTimersByTime(50);
    await waitFor(() => {
      const menu = screen.getByText('ВЫЙТИ ИЗ ПРОФИЛЯ');
      expect(menu).toBeInTheDocument();
      expect(menu).toBeVisible();
    });
    
    fireEvent.click(profileButton);
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      expect(screen.queryByText('ВЫЙТИ ИЗ ПРОФИЛЯ')).not.toBeInTheDocument();
    });
  });

  test('отображает имя пользователя из сессии', async () => {
    render(<UserProfile />);
    
    const profileButton = screen.getByAltText('Profile');
    fireEvent.click(profileButton);
    
    jest.advanceTimersByTime(50);
    await waitFor(() => {
      expect(screen.getByText('Тестовый Пользователь')).toBeInTheDocument();
    });
  });

  test('вызывает signOut при клике на кнопку выхода', async () => {
    const { signOut } = require('next-auth/react');
    render(<UserProfile />);
    
    fireEvent.click(screen.getByAltText('Profile'));
    jest.advanceTimersByTime(50);
    
    const logoutButton = await screen.findByText('ВЫЙТИ ИЗ ПРОФИЛЯ');
    fireEvent.click(logoutButton);
    
    expect(signOut).toHaveBeenCalled();
  });
}); 