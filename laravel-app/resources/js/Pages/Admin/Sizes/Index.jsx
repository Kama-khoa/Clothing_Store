import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import Breadcrumb from '@/Components/Breadcrumb';
import SizeForm from './SizeForm';
import axios from 'axios';
import { ArrowUpDown } from 'lucide-react';

export default function Index() {
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editSize, setEditSize] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1
    });
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    const fetchSizes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/sizes', {
                params: {
                    search,
                    page: pagination.current_page,
                    per_page: pagination.per_page,
                    sort_field: sortField,
                    sort_direction: sortDirection
                }
            });

            if (response.data && response.data.data) {
                setSizes(response.data.data);
                setPagination({
                    current_page: response.data.current_page,
                    per_page: response.data.per_page,
                    total: response.data.total,
                    last_page: response.data.last_page
                });
            }
        } catch (error) {
            console.error('Error fetching sizes:', error);
            setSizes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchSizes();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, pagination.current_page, sortField, sortDirection]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleDelete = async (sizeId) => {
        if (confirm('Bạn có muốn xóa?')) {
            try {
                const response = await axios.delete(`/admin/sizes/${sizeId}`);
                if (response.status === 200) {
                    fetchSizes();
                    alert('Xóa thành công');
                }
            } catch (error) {
                console.error('Error deleting size:', error);
                alert(error.response?.data?.message || `Error deleting size ${sizeId}`);
            }
        }
    };

    const breadcrumbItems = [
        { label: 'Kích thước', href: '/admin/sizes' }
    ];

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= pagination.last_page; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={pagination.current_page === i ? "default" : "outline"}
                    className="w-10 h-10"
                    onClick={() => setPagination(prev => ({ ...prev, current_page: i }))}
                >
                    {i}
                </Button>
            );
        }
        return pages;
    };

    const SortableHeader = ({ field, children }) => (
        <TableHead
            className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center space-x-1">
                <span>{children}</span>
                <ArrowUpDown className="w-4 h-4" />
            </div>
        </TableHead>
    );

    return (
        <AdminLayout>
            <Head title="Sizes Management" />

            <div className="container mx-auto py-6 px-4">
                <Breadcrumb items={breadcrumbItems} />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Kích thước</h1>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-64"
                        />
                        <Button
                            onClick={() => {
                                setEditSize(null);
                                setShowForm(true);
                            }}
                        >
                            Thêm mới
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <SortableHeader field="name">Tên</SortableHeader>
                                    <TableHead className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</TableHead>
                                    <TableHead className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-4">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : !sizes || sizes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                                            No sizes found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sizes.map((size) => (
                                        <TableRow
                                            key={size.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <TableCell className="py-4 px-6 text-sm text-gray-900">{size.name}</TableCell>
                                            <TableCell className="py-4 px-6 text-center text-sm text-gray-900">
                                                {size.description?.substring(0, 50)}
                                                {size.description?.length > 50 ? '...' : ''}
                                            </TableCell>
                                            <TableCell className="py-4 px-6 text-sm text-gray-900">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        className="text-blue-600 hover:text-blue-700 border border-blue-600 hover:border-blue-700"
                                                        onClick={() => {
                                                            setEditSize(size);
                                                            setShowForm(true);
                                                        }}
                                                    >
                                                        Cập nhật
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        className="bg-red-600 text-center hover:bg-red-700 text-white"
                                                        onClick={() => handleDelete(size.id)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-between items-center p-4 border-t">
                        <div className="text-sm text-gray-600">
                            Hiển thị {sizes.length} trên {pagination.total} kết quả
                        </div>
                        <div className="flex gap-2">
                            {renderPagination()}
                        </div>
                    </div>
                </div>

                {showForm && (
                    <SizeForm
                        size={editSize}
                        onClose={() => {
                            setShowForm(false);
                            setEditSize(null);
                        }}
                        onSuccess={() => {
                            setShowForm(false);
                            setEditSize(null);
                            fetchSizes();
                        }}
                    />
                )}
            </div>
        </AdminLayout>
    );
}
