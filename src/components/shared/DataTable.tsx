'use client';

import React from 'react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: (field: string) => void;
  className?: string;
}

export const DataTable = <T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  sortField,
  sortDirection,
  onSort,
  className = '',
}: DataTableProps<T>) => {
  
  return (
    <div className={`data-table-wrapper ${className}`}>
      <table className="data-table">
        <thead className="data-table__header">
          <tr>
            {columns.map((col) => (
              <th 
                key={String(col.key)}
                className={`data-table__cell data-table__cell--header ${col.sortable ? 'data-table__cell--sortable' : ''}`}
                onClick={() => col.sortable && onSort && onSort(String(col.key))}
                aria-sort={sortField === col.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                <div className="data-table__header-content">
                  {col.label}
                  {col.sortable && sortField === col.key && (
                    <span className={`data-table__sort-icon data-table__sort-icon--${sortDirection}`}>
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                  {col.sortable && sortField !== col.key && (
                    <span className="data-table__sort-icon data-table__sort-icon--inactive">
                      ↕
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="data-table__cell data-table__loading">
                <div className="data-table__skeleton">Loading...</div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="data-table__cell data-table__empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr 
                key={i} 
                className={`data-table__row ${onRowClick ? 'data-table__row--clickable' : ''}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="data-table__cell">
                    {col.render ? col.render(row) : (row[col.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
