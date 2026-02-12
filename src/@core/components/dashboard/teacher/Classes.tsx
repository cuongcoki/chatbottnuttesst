"use client";

import  { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { UsersIcon, BookOpenIcon, Users } from "lucide-react"; // ✅ Thêm Users icon
import { useClassStore } from "@/utility/stores/classesStore";
import { useTeacherStore } from "@/utility/stores/teacherStores";
import { useEnrollmentStore } from "@/utility/stores/enrollmentsStore"; // ✅ Import
import { useOnlineUsers } from "@/services/useOnlineUsers"; // ✅ Import
import { IEnrollmentItem } from "@/domain/interfaces/IErollment"; // ✅ Import

const Classes = () => {
  const { classes, getClassesByTeacher, setIdClass, getIdClass } =
    useClassStore();
  const { teacher, getProfileTeacher } = useTeacherStore();
  const { enrollments, getEnrollmentsByClass } = useEnrollmentStore(); // ✅ Thêm store
  const { onlineUsers } = useOnlineUsers(); // ✅ Thêm hook

  // ✅ Load teacher trước
  useEffect(() => {
    getProfileTeacher();
  }, []);

  // ✅ Khi teacher đã có, mới load classes
  useEffect(() => {
    if (teacher?._id) {
      getClassesByTeacher(teacher.user_id._id);
    }
  }, [teacher?._id]);

  // ✅ Load enrollments khi có class được chọn
  useEffect(() => {
    const selectedClassId = getIdClass();
    if (selectedClassId) {
      getEnrollmentsByClass(selectedClassId);
    }
  }, [getIdClass()]);

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ Tính số học sinh online cho class được chọn
  const selectedClassOnlineCount = useMemo(() => {
    if (!getIdClass() || enrollments.length === 0) return 0;

    return enrollments.filter((enrollment: IEnrollmentItem) => {
      const userId = enrollment.student_id.user_id._id;
      return onlineUsers.some((u) => u.userId === userId);
    }).length;
  }, [enrollments, onlineUsers, getIdClass()]);

  // Filter classes based on search and status
  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const matchesSearch = cls.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        selectedStatus === "ALL" ||
        (selectedStatus === "OPEN" && cls.is_active) ||
        (selectedStatus === "CLOSED" && !cls.is_active);
      return matchesSearch && matchesStatus;
    });
  }, [classes, searchQuery, selectedStatus]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClasses = filteredClasses.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Handle page change
  const handleTakeId = (id: string) => {
    setIdClass(id);
  };

  return (
    <aside className="lg:w-1/5 w-full bg-white dark:backdrop-blur-xl dark:bg-white/10 border border-white/20 p-3 space-y-3 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <BookOpenIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Quản lý lớp học
          </h2>
        </div>

        {/* ✅ Hiển thị số online cho class được chọn */}
        {getIdClass() && enrollments.length > 0 && (
          <Badge
            variant="outline"
            className="px-2 py-1 bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-400"
          >
            <Users className="w-3 h-3 mr-1" />
            <span className="text-xs font-semibold">
              {selectedClassOnlineCount}/{enrollments.length}
            </span>
          </Badge>
        )}
      </div>

      <Separator />

      {/* Search Input */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <Input
          type="text"
          placeholder="Tìm kiếm tên lớp..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600"
        />
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
            Trạng thái
          </label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full bg-white dark:bg-slate-800">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="OPEN">✅ Đang mở</SelectItem>
              <SelectItem value="CLOSED">🔒 Đã đóng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
        <span className="font-medium">
          Tìm thấy{" "}
          <span className="text-blue-600 dark:text-blue-400 font-bold">
            {filteredClasses.length}
          </span>{" "}
          lớp học
        </span>
        {filteredClasses.length > 0 && (
          <span>
            Trang {currentPage}/{totalPages}
          </span>
        )}
      </div>

      <Separator />

      {/* Danh sách lớp học */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {currentClasses.length > 0 ? (
          currentClasses.map((cls) => (
            <div
              key={cls.id}
              onClick={() => handleTakeId(cls.id)}
              className={`
                group cursor-pointer p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200
                hover:from-blue-50 hover:to-blue-100 
                dark:from-slate-800 dark:to-slate-850 dark:hover:from-slate-700 dark:hover:to-slate-750
                ${
                  cls.id === getIdClass()
                    ? "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-700 dark:to-slate-750 border-blue-300 dark:border-blue-600"
                    : ""
                }
              `}
            >
              {/* Header with name and status */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    Lớp {cls.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {cls.code}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <Badge
                    variant={cls.is_active ? "default" : "secondary"}
                    className={
                      cls.is_active
                        ? "bg-green-500 hover:bg-green-600 text-white text-xs"
                        : "bg-gray-400 hover:bg-gray-500 text-white text-xs"
                    }
                  >
                    {cls.is_active ? "Mở" : "Đóng"}
                  </Badge>

                  {/* ✅ Hiển thị badge online CHỈ cho class được chọn */}
                  {cls.id === getIdClass() && enrollments.length > 0 && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-400 text-xs px-1.5"
                    >
                      <Users className="w-3 h-3 mr-0.5" />
                      {selectedClassOnlineCount}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1.5">
                {/* Current/Max students */}
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <UsersIcon className="w-3.5 h-3.5" />
                  <span>
                    Sĩ số:{" "}
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {cls.current_students}/{cls.max_students}
                    </span>
                  </span>
                </div>

                {/* School year */}
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <span>Năm học: </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {cls.school_year}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <svg
              className="mx-auto w-16 h-16 mb-3 opacity-30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm font-medium">Không tìm thấy lớp học nào</p>
            <p className="text-xs mt-1">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <>
          <Separator />
          <div className="pt-1">
            <Pagination>
              <PaginationContent className="flex-wrap justify-center gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={`cursor-pointer ${
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-gray-100 dark:hover:bg-slate-700"
                    }`}
                  />
                </PaginationItem>

                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => setCurrentPage(page as number)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={`cursor-pointer ${
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-gray-100 dark:hover:bg-slate-700"
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </aside>
  );
};

export default Classes;