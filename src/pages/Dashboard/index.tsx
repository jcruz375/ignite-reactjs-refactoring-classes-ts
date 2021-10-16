import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { useEffect, useState } from 'react';
import { FoodTypes } from '../../types';

export default function Dashboard() {
  const [foods, setFoods] = useState<FoodTypes[]>([]);
  const [editingFood, setEditingFood] = useState<FoodTypes>({
    id:0,
    name: '',
    image: '',
    description: '',
    available: true,
    price: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function getFoods() {
      const response = await api.get<FoodTypes[]>('foods');

      setFoods(response.data);
    };

    getFoods();
  }, []);

  async function handleAddFood(food: FoodTypes) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([
        ...foods,
        response.data
      ])
    } catch (error) {
      alert('erro ao adicionar comida');
      console.log(error);
    }
  };

  async function handleUpdateFood(food: FoodTypes) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (error) {
      alert("ocorreu um erro inexperado");
      console.log(error);
    };
  };

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  };

  function toggleModal() {
    setModalOpen(!modalOpen);
  };

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  };

  function handleEditFood(food: FoodTypes) {
    setEditingFood(food);
    setEditModalOpen(true);
  };

  return (
    <>
    <Header openModal={toggleModal} />
    <ModalAddFood
      isOpen={modalOpen}
      setIsOpen={toggleModal}
      handleAddFood={handleAddFood}
    />
    <ModalEditFood
      isOpen={editModalOpen}
      setIsOpen={toggleEditModal}
      editingFood={editingFood}
      handleUpdateFood={handleUpdateFood}
    />

    <FoodsContainer data-testid="foods-list">
      {foods &&
        foods.map(food => (
          <Food
            key={food.id}
            food={food}
            handleDelete={handleDeleteFood}
            handleEditFood={handleEditFood}
          />
        ))}
    </FoodsContainer>
  </>
  )
};