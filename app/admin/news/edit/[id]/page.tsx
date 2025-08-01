"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/news`)
      .then((res) => res.json())
      .then((data) => {
        const news = data.find((n: any) => n.id === id);
        if (news) {
          setTitle(news.title);
          setDescription(news.description);
          setDate(news.date ? news.date.slice(0, 10) : "");
          setStartDate(news.startDate ? news.startDate.slice(0, 10) : "");
          setEndDate(news.endDate ? news.endDate.slice(0, 10) : "");
        } else {
          setError("الخبر غير موجود");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("فشل في تحميل الخبر");
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`/api/news/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, date, startDate, endDate }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حدث خطأ ما");
      } else {
        setSuccess("تم تحديث الخبر بنجاح");
        setTimeout(() => router.push("/admin/news/manage"), 1500);
      }
    } catch (err) {
      setError("حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">تعديل الخبر</h1>
        {loading ? (
          <div className="text-center">جاري التحميل...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block mb-1 font-semibold text-gray-700">العنوان</label>
              <input
                type="text"
                placeholder="العنوان"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-lg w-full transition"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">الوصف</label>
              <textarea
                placeholder="الوصف"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-lg w-full min-h-[120px] transition"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-semibold text-gray-700">تاريخ النشر</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-2 rounded-lg w-full transition"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-700">تاريخ البداية</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-2 rounded-lg w-full transition"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-700">تاريخ النهاية</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-2 rounded-lg w-full transition"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-l from-blue-600 to-blue-400 text-white py-3 rounded-lg font-bold text-lg shadow hover:from-blue-700 hover:to-blue-500 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "جاري التحديث..." : "تحديث الخبر"}
            </button>
            {error && <div className="text-red-600 text-center font-semibold">{error}</div>}
            {success && <div className="text-green-600 text-center font-semibold">{success}</div>}
          </form>
        )}
      </div>
    </div>
  );
} 