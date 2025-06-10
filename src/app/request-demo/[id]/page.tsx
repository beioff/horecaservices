'use client';

import { useState } from 'react';
import { companies } from '@/companies';
import Link from 'next/link';

export default function RequestDemo({ params }: { params: { id: string } }) {
  const company = companies.find(c => c.id === params.id);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    venueName: '',
    tasks: '',
    preferredTime: '',
    additionalInfo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!company) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Компания не найдена</h1>
          <Link href="/" className="btn btn-primary">
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-custom py-16">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center text-neutral-600 hover:text-primary mb-8">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Назад к предложениям
          </Link>

          <div className="card p-8">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-beige-50 mr-6 overflow-hidden">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-full h-full object-contain p-3"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">{company.name}</h1>
                <p className="text-neutral-600">{company.slogan}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                  Ваше имя *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Введите ваше имя"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                  Телефон *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="input"
                  placeholder="+7 (___) ___-__-__"
                />
              </div>

              <div>
                <label htmlFor="venueName" className="block text-sm font-medium text-neutral-700 mb-2">
                  Название заведения *
                </label>
                <input
                  type="text"
                  id="venueName"
                  name="venueName"
                  required
                  value={formData.venueName}
                  onChange={handleChange}
                  className="input"
                  placeholder="Введите название вашего заведения"
                />
              </div>

              <div>
                <label htmlFor="tasks" className="block text-sm font-medium text-neutral-700 mb-2">
                  Какие задачи хотите закрыть? *
                </label>
                <textarea
                  id="tasks"
                  name="tasks"
                  required
                  value={formData.tasks}
                  onChange={handleChange}
                  className="input min-h-[100px]"
                  placeholder="Опишите ваши задачи"
                />
              </div>

              <div>
                <label htmlFor="preferredTime" className="block text-sm font-medium text-neutral-700 mb-2">
                  Удобное время для связи *
                </label>
                <input
                  type="text"
                  id="preferredTime"
                  name="preferredTime"
                  required
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className="input"
                  placeholder="Например: будни с 10:00 до 18:00"
                />
              </div>

              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-neutral-700 mb-2">
                  Дополнительная информация
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  className="input min-h-[100px]"
                  placeholder="Любая дополнительная информация, которая может быть полезна"
                />
              </div>

              <button type="submit" className="btn btn-primary w-full hover-glow">
                Отправить заявку
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 