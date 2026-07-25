"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight, Folder, MoreVertical, Edit, Trash2, Plus, Package } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { Badge } from '@/shared/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/shared/components/ui/dropdown-menu';
import type { CategoryTreeNode } from '../types/category.types';
import { useUpdateCategory } from '../hooks/use-categories';

interface CategoryTreeNodeProps {
  node: CategoryTreeNode;
  onEdit: (uuid: string) => void;
  onDelete: (node: CategoryTreeNode) => void;
  onAddChild: (parentUuid: string) => void;
  searchQuery?: string;
}

export function CategoryTreeNodeItem({
  node,
  onEdit,
  onDelete,
  onAddChild,
  searchQuery,
}: CategoryTreeNodeProps) {
  const router = useRouter();
  const updateCategory = useUpdateCategory(node.uuid);
  const [isExpanded, setIsExpanded] = useState(false);

  // Load state from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`cat_expanded_${node.uuid}`);
    if (saved) setIsExpanded(JSON.parse(saved));
  }, [node.uuid]);

  // Auto-expand if search query matches children or self
  useEffect(() => {
    if (searchQuery) {
      setIsExpanded(true);
    }
  }, [searchQuery]);

  const toggleExpand = () => {
    const newVal = !isExpanded;
    setIsExpanded(newVal);
    localStorage.setItem(`cat_expanded_${node.uuid}`, JSON.stringify(newVal));
  };

  const handleToggleActive = () => {
    updateCategory.mutate({
      ...node,
      active_status: !node.active_status,
      // Pass the parent_id if needed, but since we use toServiceData it's handled via parent_uuid or parent_id
    });
  };

  const hasChildren = node.children && node.children.length > 0;
  const isMaxDepth = node.level >= 3;

  return (
    <div className="flex flex-col select-none">
      <div 
        className="flex items-center gap-3 py-3 px-4 hover:bg-slate-50 transition-colors border-b border-slate-100 group"
        style={{ paddingRight: `${node.level * 1.5 + 1}rem` }} // RTL indentation
      >
        {/* Expand/Collapse Toggle */}
        <div className="w-6 flex items-center justify-center shrink-0">
          {hasChildren ? (
            <button 
              onClick={toggleExpand}
              className="p-1 rounded-md hover:bg-slate-200 text-slate-500 transition-colors"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4 rtl:rotate-180" />}
            </button>
          ) : (
            <span className="w-6" /> // spacer
          )}
        </div>

        {/* Thumbnail or Folder Icon */}
        <div className="w-8 h-8 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
          {node.cover_image_url ? (
            <Image
              src={node.cover_image_url}
              alt={node.name}
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          ) : (
            <Folder className="h-4 w-4 text-slate-400" />
          )}
        </div>

        {/* Name and Meta */}
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-900 truncate">
            {node.name}
          </span>
          <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-slate-50">
            L{node.level}
          </Badge>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Package className="h-3 w-3" />
            ({node.products_count || 0} منتج)
          </span>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-3 shrink-0 mr-4 ml-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              {node.active_status ? 'نشط' : 'مخفي'}
            </span>
            <Switch
              checked={node.active_status}
              onCheckedChange={handleToggleActive}
              disabled={updateCategory.isPending}
            />
          </div>
        </div>

        {/* Actions Dropdown */}
        <div className="shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-slate-100 hover:text-slate-900 h-8 w-8 text-slate-500">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(node.uuid)}>
                <Edit className="ml-2 h-4 w-4" />
                تعديل القسم
              </DropdownMenuItem>
              {!isMaxDepth ? (
                <DropdownMenuItem onClick={() => onAddChild(node.uuid)}>
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة قسم فرعي
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem disabled>
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة فرعي (الحد 3 مستويات)
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(node)}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="ml-2 h-4 w-4" />
                حذف القسم
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Render Children */}
      {isExpanded && hasChildren && (
        <div className="flex flex-col">
          {node.children!.map((child) => (
            <CategoryTreeNodeItem
              key={child.uuid}
              node={child}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
}
