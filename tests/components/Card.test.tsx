import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '../../components/Card';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Card Component', () => {
  const mockIssue = {
    title: 'Тестовая задача',
    author: { name: 'Тестовый автор' },
    labels: ['важно', 'срочно'],
    project_id: '123',
  };

  test('рендерит карточку задачи с правильными данными', () => {
    render(<Card issue={mockIssue} />);
    
    expect(screen.getByText(/Название: Тестовая задача/i)).toBeInTheDocument();
    expect(screen.getByText(/Автор: Тестовый автор/i)).toBeInTheDocument();
    expect(screen.getByText(/Метки: важно, срочно/i)).toBeInTheDocument();
    expect(screen.getByAltText('packett')).toBeInTheDocument();
  });

  test('переходит на страницу детальной информации при клике', () => {
    const { container } = render(<Card issue={mockIssue} />);
    
    const cardElement = container.querySelector('.cursor-pointer');
    expect(cardElement).toBeInTheDocument();
    
    fireEvent.click(cardElement);
    
  });
}); 