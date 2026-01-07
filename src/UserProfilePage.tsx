import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  API_BASE_URL,
  API_ENDPOINTS,
  PAGINATION,
  DEFAULT_VALUES,
} from "./constants";
import * as userApi from "./api/auth";

// ==================== ТИПЫ ====================
interface Props {
  token: string | null;
}

interface PurchaseResponse {
  id: string;
  clientId: string;
  ticketIds: string[];
  totalCents: number;
  status: string;
  createdAt: string;
  filmId: string;
  seats: string[];
}

interface ReviewForm {
  rating: number;
  text: string;
}

// =====================================================

const UserProfilePage: React.FC<Props> = ({ token }) => {
  // Состояние пользователя
  const [user, setUser] = useState<userApi.User | null>(null);
  const [form, setForm] = useState({
    firstName: DEFAULT_VALUES.EMPTY_STRING,
    lastName: DEFAULT_VALUES.EMPTY_STRING,
    email: DEFAULT_VALUES.EMPTY_STRING,
    age: DEFAULT_VALUES.DEFAULT_AGE,
    gender: "Женский",
  });
  const [editing, setEditing] = useState(false);

  // Состояние покупок
  const [purchases, setPurchases] = useState<PurchaseResponse[]>([]);
  const [filmTitles, setFilmTitles] = useState<Record<string, string>>({});
  const [reviewForms, setReviewForms] = useState<Record<string, ReviewForm>>({});

  // Загрузка данных пользователя
  useEffect(() => {
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setForm({
          firstName: res.data.firstName || DEFAULT_VALUES.EMPTY_STRING,
          lastName: res.data.lastName || DEFAULT_VALUES.EMPTY_STRING,
          email: res.data.email || DEFAULT_VALUES.EMPTY_STRING,
          age: res.data.age || DEFAULT_VALUES.DEFAULT_AGE,
          gender: res.data.gender || "Женский",
        });
      } catch (err) {
        console.error("Ошибка загрузки данных пользователя:", err);
      }
    };

    fetchUserData();
  }, [token]);

  // Загрузка покупок
  useEffect(() => {
    if (!token) return;

    const fetchPurchases = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.PURCHASES}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              page: PAGINATION.DEFAULT_PAGE,
              size: PAGINATION.PURCHASES_PAGE_SIZE,
            },
          }
        );

        const mapped: PurchaseResponse[] = res.data.data.map((p: any) => ({
          id: p.id,
          clientId: p.clientId,
          ticketIds: p.ticketIds,
          totalCents: p.totalCents,
          status: p.status,
          createdAt: p.createdAt,
          filmId: p.filmId,
          seats: p.seats || [],
        }));

        setPurchases(mapped);

        // Загрузка информации о фильмах
        const uniqueIds = [...new Set(mapped.map((p) => p.filmId))];
        const filmData: Record<string, string> = {};

        await Promise.all(
          uniqueIds.map(async (id) => {
            try {
              const filmRes = await axios.get(
                `${API_BASE_URL}${API_ENDPOINTS.FILMS}/${id}`
              );
              filmData[id] = filmRes.data.title;
            } catch {
              filmData[id] = "Неизвестный фильм";
            }
          })
        );

        setFilmTitles(filmData);
      } catch (err) {
        console.error("Ошибка загрузки покупок:", err);
      }
    };

    fetchPurchases();
  }, [token]);

  // Обработка изменения полей формы
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) : value,
    }));
  };

  // Сохранение профиля
  const handleSaveProfile = async () => {
    if (!token) return;

    try {
      await axios.put(
        `${API_BASE_URL}/user`,
        {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          age: form.age,
          gender: form.gender === "Женский" ? "FEMALE" : "MALE",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Профиль успешно обновлен!");
      setEditing(false);
    } catch (err) {
      console.error("Ошибка обновления профиля:", err);
      alert("Ошибка при обновлении профиля");
    }
  };

  // Добавление отзыва
  const handleAddReview = async (purchaseId: string) => {
    if (!token || !reviewForms[purchaseId]) return;

    const review = reviewForms[purchaseId];
    const purchase = purchases.find((p) => p.id === purchaseId);
    if (!purchase) return;

    try {
      await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.FILMS}/${purchase.filmId}${API_ENDPOINTS.REVIEWS}`,
        {
          rating: review.rating,
          text: review.text,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Отзыв успешно добавлен!");
      setReviewForms((prev) => ({
        ...prev,
        [purchaseId]: {
          rating: DEFAULT_VALUES.ZERO,
          text: DEFAULT_VALUES.EMPTY_STRING,
        },
      }));
    } catch (err) {
      console.error("Ошибка при добавлении отзыва:", err);
      alert("Ошибка при добавлении отзыва");
    }
  };

  if (!user) {
    return (
      <div className="app-container min-vh-100 d-flex flex-column bg-dark text-light">
        <div className="container py-5">
          <p>Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container min-vh-100 d-flex flex-column bg-dark text-light">
      <div className="container py-5">
        <h2 className="text-primary mb-4">Мой профиль</h2>

        <div className="row">
          {/* Секция информации о профиле */}
          <div className="col-md-6 mb-4">
            <div className="card bg-secondary text-light p-4">
              <h5 className="mb-3">Информация о профиле</h5>
              {!editing ? (
                <div>
                  <p>
                    <strong>Имя:</strong> {form.firstName}
                  </p>
                  <p>
                    <strong>Фамилия:</strong> {form.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {form.email}
                  </p>
                  <p>
                    <strong>Возраст:</strong> {form.age}
                  </p>
                  <p>
                    <strong>Пол:</strong> {form.gender}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setEditing(true)}
                  >
                    Редактировать
                  </button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    placeholder="Имя"
                    value={form.firstName}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    placeholder="Фамилия"
                    value={form.lastName}
                    onChange={handleInputChange}
                  />
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    name="age"
                    className="form-control"
                    placeholder="Возраст"
                    value={form.age}
                    onChange={handleInputChange}
                  />
                  <select
                    name="gender"
                    className="form-control"
                    value={form.gender}
                    onChange={handleInputChange}
                  >
                    <option value="Женский">Женский</option>
                    <option value="Мужской">Мужской</option>
                  </select>
                  <button
                    className="btn btn-success"
                    onClick={handleSaveProfile}
                  >
                    Сохранить
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditing(false)}
                  >
                    Отмена
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Секция истории покупок */}
          <div className="col-md-6 mb-4">
            <div className="card bg-secondary text-light p-4">
              <h5 className="mb-3">История покупок</h5>
              {purchases.length === 0 ? (
                <p>У вас нет покупок</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {purchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="bg-dark p-3 rounded border border-light"
                    >
                      <p>
                        <strong>Фильм:</strong> {filmTitles[purchase.filmId] || "Загрузка..."}
                      </p>
                      <p>
                        <strong>Сумма:</strong> {purchase.totalCents} ₽
                      </p>
                      <p>
                        <strong>Дата:</strong> {new Date(purchase.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Статус:</strong> {purchase.status}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Секция отзывов */}
        <div className="row mt-4">
          <div className="col-12">
            <h3 className="text-primary mb-4">Оставить отзыв</h3>
            {purchases.length === 0 ? (
              <p>У вас нет покупок для оставления отзывов</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {purchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="card bg-secondary text-light p-4"
                  >
                    <h6 className="mb-3">
                      {filmTitles[purchase.filmId] || "Загрузка..."}
                    </h6>
                    <div className="d-flex flex-column gap-2">
                      <div>
                        <label className="mb-2">Оценка:</label>
                        <select
                          className="form-control"
                          value={reviewForms[purchase.id]?.rating || 0}
                          onChange={(e) =>
                            setReviewForms((prev) => ({
                              ...prev,
                              [purchase.id]: {
                                ...prev[purchase.id],
                                rating: parseInt(e.target.value),
                              },
                            }))
                          }
                        >
                          <option value={0}>Выберите оценку</option>
                          <option value={1}>1 звезда</option>
                          <option value={2}>2 звезды</option>
                          <option value={3}>3 звезды</option>
                          <option value={4}>4 звезды</option>
                          <option value={5}>5 звезд</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-2">Ваш отзыв:</label>
                        <textarea
                          className="form-control"
                          placeholder="Напишите ваш отзыв..."
                          value={reviewForms[purchase.id]?.text || DEFAULT_VALUES.EMPTY_STRING}
                          onChange={(e) =>
                            setReviewForms((prev) => ({
                              ...prev,
                              [purchase.id]: {
                                ...prev[purchase.id],
                                text: e.target.value,
                              },
                            }))
                          }
                          rows={3}
                        ></textarea>
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleAddReview(purchase.id)}
                      >
                        Отправить отзыв
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
