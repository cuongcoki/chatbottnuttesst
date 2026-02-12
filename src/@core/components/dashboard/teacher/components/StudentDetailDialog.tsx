// Detail Dialog Component

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Activity, BookOpen, Calendar, Eye, GraduationCap, School, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Student } from '../Student';
const StudentDetailDialog = ({ student }: { student: Student }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              {/* <AvatarImage src={student.avatar} alt={student.name} /> */}
              <AvatarFallback>
                {/* {student.name?.charAt(0) || student.student_code.charAt(0)} */}
              </AvatarFallback>
            </Avatar>
            <div>
              {/* <div className="text-lg font-bold">{student.name || 'N/A'}</div> */}
              <div className="text-sm text-gray-500 font-mono">
                {student.student_code}
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết học sinh
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                <GraduationCap className="h-4 w-4" />
                Khối lớp
              </div>
              <div className="text-base font-semibold pl-6">
                {/* {GRADE_LEVELS[student.grade_level] || `Lớp ${student.grade_level}`} */}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                <BookOpen className="h-4 w-4" />
                Lớp hiện tại
              </div>
              <div className="text-base font-semibold pl-6">
                {student.current_class}
              </div>
            </div>
          </div>

          {/* School */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              <School className="h-4 w-4" />
              Trường học
            </div>
            <div className="text-base font-semibold pl-6">
              {student.school_name}
            </div>
          </div>

          {/* Learning Preferences */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                <UserCircle className="h-4 w-4" />
                Phong cách học
              </div>
              <div className="pl-6">
                <Badge variant="outline">
                  {/* {LEARNING_STYLES[student.learning_style] || student.learning_style} */}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                <Activity className="h-4 w-4" />
                Độ khó ưa thích
              </div>
              <div className="pl-6">
                <Badge 
                  // className={`${DIFFICULTY_LEVELS[student.difficulty_preference]?.color || 'bg-gray-500'} text-white`}
                >
                  {/* {DIFFICULTY_LEVELS[student.difficulty_preference]?.label || student.difficulty_preference} */}
                </Badge>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                Ngày tạo
              </div>
              <div className="text-sm pl-6">
                {formatDate(student.created_at)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                <Activity className="h-4 w-4" />
                Hoạt động gần nhất
              </div>
              <div className="text-sm pl-6">
                {formatDate(student.last_active)}
              </div>
            </div>
          </div>

          {/* User ID */}
          <div className="space-y-2 pt-2 border-t">
            <div className="text-xs font-medium text-gray-500">User ID</div>
            {/* <div className="text-xs font-mono text-gray-400">{student.user_id}</div> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailDialog;