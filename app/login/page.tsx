'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { LogIn } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login, isAuthenticated } = useAuth()
    const router = useRouter()

    // Redirect if already authenticated
    if (isAuthenticated) {
        router.push('/dashboard')
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await login(username, password)
            router.push('/dashboard')
        } catch (err: any) {
            setError(err.message || 'Đăng nhập thất bại')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark to-blue-400 py-12 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-lg shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-4 shadow-lg p-3">
                            <Image
                                src="/img/logo.webp"
                                alt="Logo Bệnh viện Trung ương Thái Nguyên"
                                width={80}
                                height={80}
                                className="object-contain"
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-primary-dark mb-2">
                            Trang quản trị            </h1>
                        <p className="text-gray-600">
                            Phòng Truyền Thống - Bệnh viện Trung ương Thái Nguyên
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="username" className="label-field">
                                Tên đăng nhập
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field"
                                required
                                placeholder="Nhập tên đăng nhập"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="label-field">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                required
                                placeholder="Nhập mật khẩu"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Đang đăng nhập...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5 mr-2" />
                                    Đăng nhập
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}


