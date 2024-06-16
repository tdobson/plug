import React from 'react';
import { Modal, Button, TextInput, NumberInput, Select, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCreateBooking, useUpdateBooking, useDeleteBooking } from '../../hooks/useBookings';
import { Booking, Villa, Customer } from '../../types/api';
import './Modal.css';

interface ModalComponentProps {
    isOpen: boolean;
    onClose: () => void;
    selectedData: Booking | null;
    onUpdate: (updatedData: Booking) => void;
    onDelete: (userId: string) => void;
    villas: Villa[];
    customers: Customer[];
}

const ModalComponent: React.FC<ModalComponentProps> = ({ isOpen, onClose, selectedData, onUpdate, onDelete, villas, customers }) => {
    const form = useForm<Booking>({
        initialValues: selectedData || {
            id: 0,
            uuid: '',
            customer_uuid: '',
            villa_uuid: '',
            start_date: '',
            end_date: '',
            adults: 1,
            children: 0,
            recorded_cost: 0,
            booked_by: '',
            amended_by: null,
            status: 'confirmed',
            booking_type: 'regular',
            created_at: '',
            updated_at: ''
        },
        validateInputOnChange: true,
    });

    const createBooking = useCreateBooking();
    const updateBooking = useUpdateBooking();
    const deleteBooking = useDeleteBooking();

    const handleSubmit = async (values: Booking) => {
        if (selectedData) {
            await updateBooking.mutateAsync({ id: selectedData.id, data: values });
        } else {
            await createBooking.mutateAsync(values);
        }
        onUpdate(values);
        onClose();
    };

    const handleDelete = async () => {
        if (selectedData) {
            await deleteBooking.mutateAsync(selectedData.id);
            onDelete(selectedData.uuid);
            onClose();
        }
    };

    return (
        <Modal opened={isOpen} onClose={onClose} title={selectedData ? 'Edit Booking' : 'New Booking'}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Select label="Customer" placeholder="Select customer" data={customers.map(c => ({ value: c.uuid, label: `${c.first_name} ${c.last_name}` }))} {...form.getInputProps('customer_uuid')} required />
                <Select label="Villa" placeholder="Select villa" data={villas.map(v => ({ value: v.uuid, label: v.name }))} {...form.getInputProps('villa_uuid')} required />
                <TextInput label="Start Date" type="date" {...form.getInputProps('start_date')} required />
                <TextInput label="End Date" type="date" {...form.getInputProps('end_date')} required />
                <NumberInput label="Adults" {...form.getInputProps('adults')} required />
                <NumberInput label="Children" {...form.getInputProps('children')} required />
                <NumberInput label="Recorded Cost" {...form.getInputProps('recorded_cost')} required />
                <Select label="Status" data={['confirmed', 'pending', 'cancelled']} {...form.getInputProps('status')} required />
                <Select label="Booking Type" data={['regular', 'vip']} {...form.getInputProps('booking_type')} required />

                <Group>
                    <Button variant="default" onClick={onClose}>Cancel</Button>
                    {selectedData && <Button color="red" onClick={handleDelete}>Delete</Button>}
                    <Button type="submit">{selectedData ? 'Update' : 'Create'}</Button>
                </Group>
            </form>
        </Modal>
    );
};

export default ModalComponent;
