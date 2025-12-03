import { useEffect, useState } from "react";
import API from "../api";
import "./AdminUsers.css";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);

    // Load danh sách user
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        API.get("/admin/users")
            .then(res => setUsers(res.data))
            .catch(err => console.log(err));
    };

    // Hàm xóa user
    const deleteUser = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này không?")) return;

        try {
            await API.delete(`/admin/users/${id}`);
            alert("Xóa tài khoản thành công!");
            fetchUsers(); // load lại danh sách
        } catch (err) {
            console.log(err);
            alert("Không thể xóa tài khoản!");
        }
    };

    return (
        <div className="admin-users-page">
            <h2>📋 Danh sách tài khoản khách hàng</h2>

            <table className="users-table">
                <thead>
                    <tr>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Vai trò</th>
                        <th>Ngày tạo</th>
                        <th>Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map(u => (
                        <tr key={u._id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.phone}</td>
                            <td>{u.role}</td>
                            <td>{new Date(u.createdAt).toLocaleString()}</td>
                            <td>
                                <button 
                                    className="delete-btn"
                                    onClick={() => deleteUser(u._id)}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
