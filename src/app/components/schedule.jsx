"use client";
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2 } from 'lucide-react';

const ScheduleRotation = () => {
  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    names: [''],
    type: 'daily',
    selectedDays: [],
    selectedMonths: [],
    selectedDates: [],
    time: '',
  });

  useEffect(() => {
    const savedSchedules = localStorage.getItem('rotationSchedules');
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    }
  }, []);

  const saveSchedules = (newSchedules) => {
    localStorage.setItem('rotationSchedules', JSON.stringify(newSchedules));
    setSchedules(newSchedules);
  };

  const handleAddName = () => {
    setFormData(prev => ({
      ...prev,
      names: [...prev.names, '']
    }));
  };

  const handleNameChange = (index, value) => {
    const newNames = [...formData.names];
    newNames[index] = value;
    setFormData(prev => ({
      ...prev,
      names: newNames
    }));
  };

  const handleRemoveName = (index) => {
    if (formData.names.length > 1) {
      const newNames = formData.names.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        names: newNames
      }));
    }
  };

  const handleDateToggle = (date) => {
    setFormData(prev => ({
      ...prev,
      selectedDates: prev.selectedDates.includes(date)
        ? prev.selectedDates.filter(d => d !== date)
        : [...prev.selectedDates, date].sort((a, b) => a - b)
    }));
  };

  const handleMonthToggle = (month) => {
    setFormData(prev => ({
      ...prev,
      selectedMonths: prev.selectedMonths.includes(month)
        ? prev.selectedMonths.filter(m => m !== month)
        : [...prev.selectedMonths, month].sort((a, b) => a - b)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSchedule = {
      id: editingSchedule ? editingSchedule.id : Date.now(),
      title: formData.title,
      names: formData.names.filter(name => name.trim()),
      type: formData.type,
      selectedDays: formData.selectedDays,
      selectedMonths: formData.selectedMonths,
      selectedDates: formData.selectedDates,
      time: formData.time,
      currentIndex: editingSchedule ? editingSchedule.currentIndex : 0
    };

    const newSchedules = editingSchedule 
      ? schedules.map(s => s.id === editingSchedule.id ? newSchedule : s)
      : [...schedules, newSchedule];

    saveSchedules(newSchedules);
    setShowForm(false);
    setEditingSchedule(null);
    setFormData({
      title: '',
      names: [''],
      type: 'daily',
      selectedDays: [],
      selectedMonths: [],
      selectedDates: [],
      time: '',
    });
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      title: schedule.title,
      names: schedule.names,
      type: schedule.type,
      selectedDays: schedule.selectedDays || [],
      selectedMonths: schedule.selectedMonths || [],
      selectedDates: schedule.selectedDates || [],
      time: schedule.time,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const newSchedules = schedules.filter(s => s.id !== id);
    saveSchedules(newSchedules);
  };

  const handleRotate = (scheduleId, direction) => {
    const newSchedules = schedules.map(schedule => {
      if (schedule.id === scheduleId) {
        let newIndex;
        if (direction === 'next') {
          newIndex = (schedule.currentIndex + 1) % schedule.names.length;
        } else {
          newIndex = (schedule.currentIndex - 1 + schedule.names.length) % schedule.names.length;
        }
        return { ...schedule, currentIndex: newIndex };
      }
      return schedule;
    });
    saveSchedules(newSchedules);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Jadwal Rotasi</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={20} /> Buat Jadwal
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-6">
              {editingSchedule ? 'Edit Jadwal' : 'Buat Jadwal Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Jadwal
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daftar Nama
                </label>
                {formData.names.map((name, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      className="flex-1 p-2 border rounded-md"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveName(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddName}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Tambah Nama
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipe Rotasi
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="daily">Harian</option>
                  <option value="weekly">Mingguan</option>
                  <option value="monthly">Bulanan</option>
                  <option value="yearly">Tahunan</option>
                </select>
              </div>

              {formData.type === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pilih Hari
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day, index) => (
                      <label key={day} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.selectedDays.includes(index)}
                          onChange={() => {
                            const newDays = formData.selectedDays.includes(index)
                              ? formData.selectedDays.filter(d => d !== index)
                              : [...formData.selectedDays, index].sort();
                            setFormData(prev => ({ ...prev, selectedDays: newDays }));
                          }}
                          className="rounded"
                        />
                        <span>{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {(formData.type === 'monthly' || formData.type === 'yearly') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pilih Tanggal
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                      <button
                        key={date}
                        type="button"
                        onClick={() => handleDateToggle(date)}
                        className={`p-2 text-center rounded-md ${
                          formData.selectedDates.includes(date)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {formData.type === 'yearly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pilih Bulan
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map((month, index) => (
                      <button
                        key={month}
                        type="button"
                        onClick={() => handleMonthToggle(index + 1)}
                        className={`p-2 text-center rounded-md ${
                          formData.selectedMonths.includes(index + 1)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waktu
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingSchedule(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingSchedule ? 'Simpan Perubahan' : 'Buat Jadwal'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-6">
          {schedules.map(schedule => (
            <div key={schedule.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{schedule.title}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(schedule)}
                    className="p-2 text-gray-600 hover:text-blue-600 rounded-md"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(schedule.id)}
                    className="p-2 text-gray-600 hover:text-red-600 rounded-md"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-lg font-medium text-gray-700">
                  Giliran Saat Ini: {schedule.names[schedule.currentIndex]}
                </p>
              </div>

              <div className="mb-4">
                <div className="border rounded-lg overflow-hidden">
                  {schedule.names.map((name, index) => (
                    <div
                      key={index}
                      className={`p-3 ${
                        index === schedule.currentIndex
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-700'
                      }`}
                    >
                      {name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleRotate(schedule.id, 'prev')}
                  className="p-2 text-gray-600 hover:text-blue-600"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => handleRotate(schedule.id, 'next')}
                  className="p-2 text-gray-600 hover:text-blue-600"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleRotation;