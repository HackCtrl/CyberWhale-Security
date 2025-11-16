import React from 'react';

// Minimal stub for table components used in admin pages
export const Table: React.FC<any> = ({ children }) => <table className="min-w-full">{children}</table>;
export const TableHeader: React.FC<any> = ({ children }) => <thead>{children}</thead>;
export const TableHead: React.FC<any> = ({ children }) => <th>{children}</th>;
export const TableBody: React.FC<any> = ({ children }) => <tbody>{children}</tbody>;
export const TableRow: React.FC<any> = ({ children }) => <tr>{children}</tr>;
export const TableCell: React.FC<any> = ({ children }) => <td>{children}</td>;
