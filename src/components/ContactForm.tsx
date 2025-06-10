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
    preferredTime: '',
    additionalInfo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Добавить логику отправки формы
    console.log('Form submitted:', { ...formData, companyId });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Запрос на демо</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Имя
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              placeholder="Введите ваше имя"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Телефон
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
              placeholder="+7 (___) ___-__-__"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Название заведения
            </label>
            <input
              type="text"
              name="establishment"
              value={formData.establishment}
              onChange={handleChange}
              className="input"
              placeholder="Введите название вашего заведения"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Какие задачи хотите закрыть?
            </label>
            <textarea
              name="tasks"
              value={formData.tasks}
              onChange={handleChange}
              className="input min-h-[100px]"
              placeholder="Опишите ваши задачи"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Удобное время для связи
            </label>
            <input
              type="text"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              className="input"
              placeholder="Например: будни с 10:00 до 18:00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Дополнительная информация
            </label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              className="input min-h-[100px]"
              placeholder="Любая дополнительная информация"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Отправить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 