
// Чтобы реализовать точный расчет количества целых блоков с учетом обрезков , нужно не просто складывать объемы
// а учитывать реальные геометрические остатки от обрезки  и возможность их повторного использования 

// Всего целых блоков  — сколько было взято изначально
// Без обрезки (100%)  — сколько блоков использовано полностью, без потерь
// Использовано из обрезков  — сколько блоков "заменено" за счёт остатков
// Осталось обрезков  — список или общее число оставшихся кусочков
class MyBlocksOptimizer
{
	constructor(blocks, blockTypes) {
	  // Переводим все блоки в формат с требуемыми размерами
	  this.blocks = blocks.map(block => ({
		...block,
		requiredLength: block.size.length * (block.upVolume / block.originalVolume),
		requiredHeight: block.size.height,
		requiredWidth: block.size.width
	  }));

	  this.blockTypes = blockTypes.map(type => ({
		length: type.length,
		height: type.height,
		width: type.width,
		volume: type.length * type.height * type.width
	  }));

	  // Храним обрезки по каждому типу
	  this.leftovers = this.blockTypes.map(() => []);

	  // Счетчики использованных блоков по типам
	  this.blocksUsed = new Array(this.blockTypes.length).fill(0);

	  // Счетчики для статистики по типам
	  this.fullBlocksUsedByType = new Array(this.blockTypes.length).fill(0);
	  this.blocksFromLeftoversByType = new Array(this.blockTypes.length).fill(0);
	}

  /**
   * Проверяет, помещается ли требуемый блок в данный кусок
   */
  canFitIn(leftover, required) {
    return (
      required.requiredLength <= leftover.remainingLength + 0.001 &&
      required.requiredHeight <= leftover.remainingHeight + 0.001 &&
      required.requiredWidth <= leftover.remainingWidth + 0.001
    );
  }

  /**
   * Находит подходящий тип блока под требование
   */
  findBestBlockType(required) {
    const suitable = [];

    for (let i = 0; i < this.blockTypes.length; i++) {
      const type = this.blockTypes[i];

      if (
        required.requiredLength <= type.length + 0.001 &&
        required.requiredHeight <= type.height + 0.001 &&
        required.requiredWidth <= type.width + 0.001
      ) {
        suitable.push({
          index: i,
          waste: type.volume - required.requiredLength * required.requiredHeight * required.requiredWidth
        });
      }
    }

    if (suitable.length === 0) return null;

    // Выбираем тот, который даёт меньше отходов
    suitable.sort((a, b) => a.waste - b.waste);
    return suitable[0].index;
  }

  /**
   * Пытается использовать обрезок любого типа или берет новый блок
   */
  useBlock2(required) {
    // Сначала ищем подходящий обрезок
    for (let i = 0; i < this.blockTypes.length; i++) {
      const leftoversOfType = this.leftovers[i];

      for (let j = 0; j < leftoversOfType.length; j++) {
        if (this.canFitIn(leftoversOfType[j], required)) {
          const leftover = leftoversOfType.splice(j, 1)[0];
          // Остается еще один обрезок
          const newLeftover = {
            remainingLength: leftover.remainingLength - required.requiredLength,
            remainingHeight: leftover.remainingHeight,
            remainingWidth: leftover.remainingWidth
          };
          if (newLeftover.remainingLength > 0.01) {
            this.leftovers[i].push(newLeftover);
          }
          this.blocksFromLeftovers++;
          return;
        }
      }
    }

    // Не нашли обрезка — берем новый блок
    const bestTypeIndex = this.findBestBlockType(required);

    if (bestTypeIndex !== null) {
      this.blocksUsed[bestTypeIndex]++;

      const type = this.blockTypes[bestTypeIndex];

      // Если блок использован полностью — увеличиваем fullBlocksUsed
      if (
        Math.abs(required.requiredLength - type.length) < 0.001 &&
        Math.abs(required.requiredHeight - type.height) < 0.001 &&
        Math.abs(required.requiredWidth - type.width) < 0.001
      ) {
        this.fullBlocksUsed++;
      }

      const newLeftover = {
        remainingLength: type.length - required.requiredLength,
        remainingHeight: type.height,
        remainingWidth: type.width
      };

      if (newLeftover.remainingLength > 0.01) {
        this.leftovers[bestTypeIndex].push(newLeftover);
      }
    } else {
      console.warn("Не найден подходящий тип блока для:", required);
    }
  }


	/**
	 * Пытается использовать обрезок нужного типа или берет новый блок
	 */
	useBlock(required) {
	  const bestTypeIndex = this.findBestBlockType(required);

	  if (bestTypeIndex === null) {
		console.warn("Не найден подходящий тип блока для:", required);
		return;
	  }

	  const blockType = this.blockTypes[bestTypeIndex];

	  // Сначала ищем подходящий обрезок только этого типа
	  const leftoversOfType = this.leftovers[bestTypeIndex];
	  for (let j = 0; j < leftoversOfType.length; j++) {
		if (this.canFitIn(leftoversOfType[j], required)) {
		  const leftover = leftoversOfType.splice(j, 1)[0];
		  const newLeftover = {
			remainingLength: leftover.remainingLength - required.requiredLength,
			remainingHeight: leftover.remainingHeight,
			remainingWidth: leftover.remainingWidth
		  };
		  if (newLeftover.remainingLength > 0.01) {
			this.leftovers[bestTypeIndex].push(newLeftover);
		  }
		  this.blocksFromLeftoversByType[bestTypeIndex]++;
		  return;
		}
	  }

	  // Не нашли обрезка — берем новый блок
	  this.blocksUsed[bestTypeIndex]++;

	  const newLeftover = {
		remainingLength: blockType.length - required.requiredLength,
		remainingHeight: blockType.height,
		remainingWidth: blockType.width
	  };

	  if (newLeftover.remainingLength > 0.01) {
		this.leftovers[bestTypeIndex].push(newLeftover);
	  }

	  // Если блок использован полностью
	  if (
		Math.abs(required.requiredLength - blockType.length) < 0.001 &&
		Math.abs(required.requiredHeight - blockType.height) < 0.001 &&
		Math.abs(required.requiredWidth - blockType.width) < 0.001
	  ) {
		this.fullBlocksUsedByType[bestTypeIndex]++;
	  }
	}


	/**
	 * Запуск оптимизации и подсчёт объёмов
	 */
	optimize() {
	  // Сортируем по объему требования (жадный алгоритм)
	  const sortedBlocks = [...this.blocks].sort(
		(a, b) =>
		  b.requiredLength * b.requiredHeight * b.requiredWidth -
		  a.requiredLength * a.requiredHeight * a.requiredWidth
	  );

	  for (const block of sortedBlocks) {
		this.useBlock(block);
	  }

	  // Подсчет статистики
	  const totalWholeBlocksVolume = this.blocksUsed.reduce((sum, count, i) => {
		return sum + count * this.blockTypes[i].volume;
	  }, 0);

	  const fullBlocksUsedVolume = this.fullBlocksUsed * this.blockTypes[0]?.volume || 0;

	  const blocksFromLeftoversVolume = this.blocksFromLeftovers * this.blockTypes[0]?.volume || 0;

	  const totalLeftoversVolume = this.leftovers.reduce((sum, leftoversOfType) => {
		return sum + leftoversOfType.reduce((s, l) => s + (l.remainingLength * l.remainingHeight * l.remainingWidth), 0);
	  }, 0);

	  const totalLeftovers = this.leftovers.reduce(
		(sum, arr) => sum + arr.length,
		0
	  );

	  return {
		// Количества
		totalWholeBlocks: this.blocksUsed.reduce((a, b) => a + b, 0),
		fullBlocksUsed: this.fullBlocksUsed,
		blocksFromLeftovers: this.blocksFromLeftovers,
		totalLeftovers,

		// Объёмы
		totalWholeBlocksVolume,
		fullBlocksUsedVolume,
		blocksFromLeftoversVolume,
		totalLeftoversVolume,

		// Детали
		blocksUsedByType: this.blocksUsed.map((count, i) => ({
		  type: this.blockTypes[i],
		  count,
		  volume: count * this.blockTypes[i].volume
		})),
		leftoversByType: this.leftovers.map((lefts, i) => ({
		  type: this.blockTypes[i],
		  leftovers: lefts,
		  totalVolume: lefts.reduce((sum, l) => sum + (l.remainingLength * l.remainingHeight * l.remainingWidth), 0)
		}))
	  };
	}
	
	
	getStatsByType() {
	  const stats = [];

	  for (let i = 0; i < this.blockTypes.length; i++) {
		const type = this.blockTypes[i];
		const usedCount = this.blocksUsed[i] || 0;
		const fullBlocksInType = this.fullBlocksUsedByType?.[i] || 0;
		const leftoverUsageForType = this.blocksFromLeftoversByType?.[i] || 0;

		const totalVolume = usedCount * type.volume;
		const fullVolume = fullBlocksInType * type.volume;
		const leftoverUsageVolume = leftoverUsageForType * type.volume;

		const leftoversOfType = this.leftovers[i] || [];
		const leftoverCount = leftoversOfType.length;
		const leftoverVolume = leftoversOfType.reduce(
		  (sum, l) => sum + (l.remainingLength * l.remainingHeight * l.remainingWidth),
		  0
		);

		stats.push({
		  type,
		  usedCount,
		  fullBlocks: fullBlocksInType,
		  usedFromLeftovers: leftoverUsageForType,
		  totalVolume,
		  fullVolume,
		  usedFromLeftoversVolume: leftoverUsageVolume,
		  leftoverCount,
		  leftoverVolume
		});
	  }

	  return stats;
	}	
}







