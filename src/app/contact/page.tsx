'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    businessName: '',
    tasks: '',
    preferredTime: '',
    additionalInfo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    // For now, just redirect back to home
    router.push('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-custom section">
        <div className="max-w-2xl mx-auto">
          <div className="card p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Оставить заявку</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                  Ваше имя
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Введите ваше имя"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="+7 (___) ___-__-__"
                />
              </div>

              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-neutral-700 mb-2">
                  Название заведения
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Введите название вашего заведения"
                />
              </div>

              <div>
                <label htmlFor="tasks" className="block text-sm font-medium text-neutral-700 mb-2">
                  Какие задачи хотите закрыть?
                </label>
                <textarea
                  id="tasks"
                  name="tasks"
                  value={formData.tasks}
                  onChange={handleChange}
                  required
                  className="input min-h-[100px]"
                  placeholder="Опишите ваши задачи"
                />
              </div>

              <div>
                <label htmlFor="preferredTime" className="block text-sm font-medium text-neutral-700 mb-2">
                  Удобное время для связи
                </label>
                <input
                  type="text"
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  required
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

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn btn-outline flex-1"
                >
                  Назад
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1 hover-glow"
                >
                  Отправить заявку
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 