import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../components/shared/CustomInput";
import Button from "../../components/shared/Button";
import { useAdminLogin } from "../../hooks/use-auth";
import { setAdminToken, setAdminUser } from "../../utils/token-storage";
import { FaEnvelope, FaLock, FaShieldAlt } from "react-icons/fa";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { mutate: login, isPending, isError, error } = useAdminLogin();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    login(form, {
      onSuccess: (data) => {
        setAdminToken(data.accessToken);
        setAdminUser(data.user);
        navigate("/overview"); 
      },
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <main className="min-h-screen bg-bg-main py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-xl border border-border p-8 md:p-10">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
            <FaShieldAlt />
          </div>
          <h1 className="text-2xl font-black text-text mb-2">لوحة تحكم سيرنا</h1>
          <p className="text-sm text-muted">أهلاً بك، يرجى تسجيل الدخول للمتابعة.</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          
          <CustomInput
            label="البريد الإلكتروني"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="admin@gmail.com"
            required
            dir="ltr"
            autoComplete="off"
            icon={<FaEnvelope />}
          />

          <CustomInput
            label="كلمة المرور"
            name="password"
            type="password" 
            value={form.password}
            onChange={handleChange}
            placeholder="********"
            required
            dir="ltr"
            autoComplete="new-password"
            icon={<FaLock />}
          />

          {isError && (
            <p className="text-sm text-red-500 font-bold bg-red-50 p-2 rounded-md border border-red-200 text-center">
              {error.response?.data?.message === 'INVALID_CREDENTIALS' 
                ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' 
                : 'حدث خطأ، يرجى المحاولة لاحقاً.'}
            </p>
          )}

          <Button 
            type="submit" 
            variant="primary"
            color="primary"
            radius="rounded-xl"
            className="w-full mt-2 py-3"
            disabled={isPending}
          >
            {isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>

        <p className="text-center text-xs text-muted mt-8">
          هذه اللوحة مخصصة للمسؤولين فقط.
        </p>
      </div>
    </main>
  );
}

export default Login;