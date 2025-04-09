import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from '../../components/modal/modal';

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: { name: 'Тестовый Пользователь' },
      accessToken: 'test-token'
    }
  })
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn()
  })
}));

jest.mock('../../services/gitlab', () => ({
  useCreateRepository: () => ({
    createRepository: jest.fn().mockResolvedValue({ id: 1, name: 'test-repo' }),
    isLoading: false
  })
}));

jest.useFakeTimers();

describe('Modal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('рендерит кнопку для открытия модального окна', () => {
    render(<Modal />);
    
    const openButton = screen.getByText('+');
    expect(openButton).toBeInTheDocument();
  });

  test('открывает модальное окно при клике на кнопку', async () => {
    render(<Modal />);
    
    fireEvent.click(screen.getByText('+'));
    
    jest.advanceTimersByTime(50);
    
    await waitFor(() => {
      expect(screen.getByText('Создать доску')).toBeInTheDocument();
    });
  });

  test('закрывает модальное окно при клике на крестик', async () => {
    render(<Modal />);
    
    fireEvent.click(screen.getByText('+'));
    jest.advanceTimersByTime(50);
    
    await waitFor(() => {
      expect(screen.getByText('Создать доску')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByAltText('icon');
    fireEvent.click(closeButton);
    
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      expect(screen.queryByText('Название доски')).not.toBeInTheDocument();
    });
  });

  test('отображает ошибку при пустом токене доступа', async () => {
    jest.spyOn(require('next-auth/react'), 'useSession').mockReturnValue({
      data: { user: { name: 'Тестовый Пользователь' } }
    });
    
    render(<Modal />);
    
    fireEvent.click(screen.getByText('+'));
    jest.advanceTimersByTime(50);
    
    fireEvent.change(screen.getByPlaceholderText(''), {
      target: { value: 'Тестовый проект' }
    });
    
    fireEvent.click(screen.getByText('Создать'));
    
    await waitFor(() => {
      expect(screen.getByText('Необходимо авторизоваться')).toBeInTheDocument();
    });
  });

  test('изменяет состояние при вводе в поле названия', () => {
    render(<Modal />);
    
    fireEvent.click(screen.getByText('+'));
    jest.advanceTimersByTime(50);
    
    const input = screen.getByPlaceholderText('');
    
    fireEvent.change(input, { target: { value: 'Новая доска' } });
    
    expect(input).toHaveValue('Новая доска');
  });

  test('кнопка создания неактивна при коротком названии', () => {
    render(<Modal />);
    
    fireEvent.click(screen.getByText('+'));
    jest.advanceTimersByTime(50);
    
    const input = screen.getByPlaceholderText('');
    fireEvent.change(input, { target: { value: 'Но' } });
    
    const createButton = screen.getByText('Создать');
    expect(createButton).toBeDisabled();
    expect(createButton).toHaveClass('opacity-50');
  });
}); 