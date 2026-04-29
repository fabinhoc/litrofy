import { defineStore } from 'pinia';
import { supabase } from 'src/boot/supabase';

export interface Vehicle {
  id?: number;
  brand: string;
  model?: string;
  year_model?: number;
  mileage: number;
  created_at?: string;
  updated_at?: string;
}

export const useVehiclesStore = defineStore('vehicles', {
  state: () => ({
    vehicles: [] as Vehicle[],
    loading: false,
  }),

  actions: {
    async fetchVehicles() {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        this.vehicles = data || [];
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        this.loading = false;
      }
    },

    async createVehicle(vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) {
      try {
        const { data, error } = await supabase.from('vehicles').insert(vehicle).select().single();

        if (error) throw error;
        this.vehicles.unshift(data);
        return data;
      } catch (error) {
        console.error('Error creating vehicle:', error);
        throw error;
      }
    },

    async updateVehicle(id: number, updates: Partial<Vehicle>) {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        const index = this.vehicles.findIndex((v) => v.id === id);
        if (index !== -1) {
          this.vehicles[index] = data;
        }
        return data;
      } catch (error) {
        console.error('Error updating vehicle:', error);
        throw error;
      }
    },

    async deleteVehicle(id: number) {
      try {
        const { error } = await supabase.from('vehicles').delete().eq('id', id);

        if (error) throw error;
        this.vehicles = this.vehicles.filter((v) => v.id !== id);
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        throw error;
      }
    },
  },
});
