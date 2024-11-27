import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from 'react';

interface User {
    id: string;
    username: string;
    FirstName: string;
    FamilyName: string;
}

interface TransferCamelModalProps {
    isOpen: boolean;
    onClose: () => void;
    camel: {
        id: string;
        name: string;
        camelID: string;
    };
    onTransfer: (newOwnerId: string) => Promise<void>;
}

export const TransferCamelModal = ({
    isOpen,
    onClose,
    camel,
    onTransfer,
}: TransferCamelModalProps) => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [usersLoading, setUsersLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                const data = await response.json();
                setUsers(data);
                setUsersLoading(false);
            } catch (err) {
                setError("Failed to load users");
            }
        };

        if (isOpen) {
            setUsersLoading(true);
            fetchUsers();
        }
    }, [isOpen]);

    const handleTransfer = async () => {
        try {
            setLoading(true);
            setError(null);
            await onTransfer(selectedUserId);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "حدث خطأ أثناء نقل المطية");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]" dir="rtl">
                <DialogHeader>
                    <DialogTitle>نقل ملكية المطية</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label>اسم المطية</label>
                        <p className="p-2 bg-gray-100 rounded">{camel.name}</p>
                    </div>
                    <div className="grid gap-2">
                        <label>رقم الشريحة</label>
                        <p className="p-2 bg-gray-100 rounded">{camel.camelID}</p>
                    </div>
                    <div className="grid gap-2">
                        <label>المالك الجديد</label>
                        <Select
                            onValueChange={setSelectedUserId}
                            value={selectedUserId}
                            disabled={usersLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="اختر المالك الجديد" />
                            </SelectTrigger>
                            <SelectContent className='max-h-96 overflow-y-auto'>
                                {users
                                    .sort((a, b) => a.FirstName?.localeCompare(b?.FirstName))
                                    .map((user) => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.FirstName} {user.FamilyName} - {user.username}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                </div>
                <DialogFooter className='flex items-center justify-start gap-4'>
                    <Button onClick={onClose} variant="outline">
                        إلغاء
                    </Button>
                    <Button onClick={handleTransfer} disabled={loading || !selectedUserId}>
                        {loading ? "جاري النقل..." : "نقل الملكية"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};