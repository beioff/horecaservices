'use client';

import { useState } from 'react';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  companyId?: string;
}

export default function ContactForm({ isOpen, onClose, companyId }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    establishment: '',
    tasks: '',
    contactTime: '',
    additionalInfo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', { ...formData, companyId });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-soft overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">Оставить заявку</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                Ваше имя
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Иван Иванов"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                Телефон
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="+7 (999) 123-45-67"
              />
            </div>
          </div>

          <div>
            <label htmlFor="establishment" className="block text-sm font-medium text-neutral-700 mb-1">
              Название заведения
            </label>
            <input
              type="text"
              id="establishment"
              name="establishment"
              value={formData.establishment}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="Ресторан 'У Моря'"
            />
          </div>

          <div>
            <label htmlFor="tasks" className="block text-sm font-medium text-neutral-700 mb-1">
              Какие задачи нужно решить?
            </label>
            <textarea
              id="tasks"
              name="tasks"
              value={formData.tasks}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              placeholder="Опишите кратко ваши задачи"
            />
          </div>

          <div>
            <label htmlFor="contactTime" className="block text-sm font-medium text-neutral-700 mb-1">
              Удобное время для связи
            </label>
            <select
              id="contactTime"
              name="contactTime"
              value={formData.contactTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            >
              <option value="">Выберите время</option>
              <option value="morning">Утро (9:00 - 12:00)</option>
              <option value="day">День (12:00 - 17:00)</option>
              <option value="evening">Вечер (17:00 - 21:00)</option>
            </select>
          </div>

          <div>
            <label htmlFor="additionalInfo" className="block text-sm font-medium text-neutral-700 mb-1">
              Дополнительная информация
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              placeholder="Любая дополнительная информация"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full btn btn-primary hover-glow text-lg py-3"
            >
              Отправить заявку
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 