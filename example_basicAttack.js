//example
/**
@Author Praise_suffering
@License MIT License
*/
var HashMap=Java.type("java.util.HashMap")
var RandomSkillItem=Java.type("tkk.epic.item.RandomSkillItem")
var StupidOnlyClientTool=Java.type("tkk.epic.utils.StupidOnlyClientTool")
var TkkEpic=Java.type("tkk.epic.TkkEpic")
var Consumer=Java.type("java.util.function.Consumer")
var Supplier=Java.type("java.util.function.Supplier")
var AnimationTemplateFunction=Java.type("tkk.epic.capability.epicAdd.animationTemplate.AnimationTemplateFunction")
var AnimationTemplate=Java.type("tkk.epic.capability.epicAdd.animationTemplate.AnimationTemplate")
var SkillManager=Java.type("tkk.epic.skill.SkillManager")
var SkillSlots=Java.type("yesman.epicfight.skill.SkillSlots")
var EpicFightCapabilities=Java.type("yesman.epicfight.world.capabilities.EpicFightCapabilities")
var EpicAddCapabilityProvider=Java.type("tkk.epic.capability.epicAdd.EpicAddCapabilityProvider")
var SkillDataKeys=Java.type("yesman.epicfight.skill.SkillDataKeys")
var EpicFightDamageSource=Java.type("yesman.epicfight.world.damagesource.EpicFightDamageSource")
var Integer=Java.type("java.lang.Integer")

function getSkillId(){return "example_basicAttack"}

var defaultModule;

var modules=new HashMap()


function init(customJsSkill){
	//注册高优先级事件
	customJsSkill.addListener(SkillManager.EventType.onExecuteSkill,4,customJsSkill.jsContainer.getFunction("onExecuteSkillHighPriority"))//优先级4 默认都是5 最小的最先执行
	//注册技能书,为了防止绿皮不会抄,单独开了个function
	regSkillBook(customJsSkill)
	//起始模块的id
	defaultModule="default";
	//new SkillModule的参数是模块id
	var Module_default=new SkillModule("default");
	Module_default.data["basicAttack"]=[];
	Module_default.data["basicAttackStamina"]=[]
	Module_default.data["basicAttack"][0]=new AnimationTemplate(StupidOnlyClientTool.getAnimation("epicfight:biped/combat/longsword_auto1"),0);
	Module_default.data["basicAttackStamina"][0]=0
	
	Module_default.data["basicAttack"][1]=new AnimationTemplate(StupidOnlyClientTool.getAnimation("epicfight:biped/combat/longsword_auto2"),0);
	Module_default.data["basicAttackStamina"][1]=0
	Module_default.data["basicAttack"][2]=new AnimationTemplate(StupidOnlyClientTool.getAnimation("epicfight:biped/combat/longsword_auto3"),0.1);
	Module_default.data["basicAttackStamina"][2]=0
	Module_default.data["airSlash"]=new AnimationTemplate(StupidOnlyClientTool.getAnimation("epicfight:biped/combat/longsword_airslash"),0);
	Module_default.data["airSlashStamina"]=2
	Module_default.data["dashAttack"]=new AnimationTemplate(StupidOnlyClientTool.getAnimation("epicfight:biped/combat/longsword_dash"),0);
	Module_default.data["dashAttackStamina"]=1
	//动作设置属性===========================
	//这个例子主要教咋写普攻,给动作设置属性那坨去看 技能例子_挽歌三连
	
	
	
	//自定义位移 时间 x y z,必须先加一次0,0,0,0不然爆炸
	AnimationTemplateFunction.customCoord_add(Module_default.data["dashAttack"],0,0,0,0)
	AnimationTemplateFunction.customCoord_add(Module_default.data["dashAttack"],0.3,0,0,-1.5)
	//设置移动逻辑 默认0，0:固定位移 1:正常移动(过于靠近目标会停止,这个经过了修改，不会因为索敌而提升距离)
	AnimationTemplateFunction.customCoord_setMoveType(Module_default.data["dashAttack"],1)
	//主要用的就canBasicAttack是否可以普通攻击
	AnimationTemplateFunction.customStateSpectrum_add(Module_default.data["dashAttack"],0,10,"canBasicAttack",false)
	//提升手感手感
	
	AnimationTemplateFunction.customCoord_add(Module_default.data["basicAttack"][0],0,0,0,0)
	AnimationTemplateFunction.customCoord_add(Module_default.data["basicAttack"][0],0.3,0,0,-1.3)
	AnimationTemplateFunction.customCoord_setMoveType(Module_default.data["basicAttack"][0],1)
	AnimationTemplateFunction.customCoord_add(Module_default.data["basicAttack"][1],0,0,0,0)
	AnimationTemplateFunction.customCoord_add(Module_default.data["basicAttack"][1],0.2,0,0,-1.1)
	AnimationTemplateFunction.customCoord_setMoveType(Module_default.data["basicAttack"][1],1)
	AnimationTemplateFunction.customCoord_add(Module_default.data["basicAttack"][2],0,0,0,0)
	AnimationTemplateFunction.customCoord_add(Module_default.data["basicAttack"][2],0.2,0,0,-1.5)
	AnimationTemplateFunction.customCoord_setMoveType(Module_default.data["basicAttack"][2],1)
	
	
	AnimationTemplateFunction.addWeaponSkillConsumption_add(Module_default.data["basicAttack"][0],0,1)
	AnimationTemplateFunction.addWeaponSkillConsumption_add(Module_default.data["basicAttack"][1],0,1)
	AnimationTemplateFunction.addWeaponSkillConsumption_add(Module_default.data["basicAttack"][2],0,1)
	AnimationTemplateFunction.addWeaponSkillConsumption_add(Module_default.data["dashAttack"],0,1)
	AnimationTemplateFunction.addWeaponSkillConsumption_add(Module_default.data["airSlash"],0,1)
	
	//跑攻.addTaril("Main",0.2,1.15,0,191,255,120,3,1)
	//跑攻.addParticleTrail(true,"dust"," 0 0 1 0.5",0.2,1.15,0.33,1,0.15,1)
	//跳劈.addTaril("Main",0.2,1.15,255,59,59,120,3,1)
	//跳劈.addParticleTrail(true,"dust"," 1 0 0 0.5",0.2,1.15,0.33,1,0.15,1)
	//是否做武器默认刀光,当你添加了刀光后默认就是false,可以用这个来启用
	AnimationTemplateFunction.customTrail_setDoVanillaTrail(Module_default.data["dashAttack"],false)
	//添加粒子刀光 参数 minX minY minZ maxX maxY maxZ 部位 起始时间 结束时间 fadeTime interpolateCount trailLifetime 粒子id 粒子参数 spaceBetween speed dist count
	AnimationTemplateFunction.customTrail_addParticleTrail(Module_default.data["dashAttack"],0,0,-0,0,0,-1.75,"Tool_R",0.0,2.7,2.75,4,3,true,false,"minecraft:dust"," 0 0 1 0.5",1,0.03,0.1,1)
	//添加刀光 参数 minX minY minZ maxX maxY maxZ 部位 起始时间 结束时间 fadeTime R G B interpolateCount trailLifetime 贴图路径(""为默认) 是主手 坐标是缩放
	AnimationTemplateFunction.customTrail_addTrail(Module_default.data["dashAttack"],0,0,-0,0,0,-1.75,"Tool_R",0.0,2.7,2.95,0,191,255,12,3,"",true,false)
	
	
	//是否做武器默认刀光,当你添加了刀光后默认就是false,可以用这个来启用
	AnimationTemplateFunction.customTrail_setDoVanillaTrail(Module_default.data["airSlash"],false)
	//添加粒子刀光 参数 minX minY minZ maxX maxY maxZ 部位 起始时间 结束时间 fadeTime interpolateCount trailLifetime 粒子id 粒子参数 spaceBetween speed dist count
	AnimationTemplateFunction.customTrail_addParticleTrail(Module_default.data["airSlash"],0,0,-0,0,0,-1.75,"Tool_R",0.0,2.7,2.75,4,3,true,false,"minecraft:dust"," 1 0 0 0.5",1,0.03,0.1,1)
	//添加刀光 参数 minX minY minZ maxX maxY maxZ 部位 起始时间 结束时间 fadeTime R G B interpolateCount trailLifetime 贴图路径(""为默认) 是主手 坐标是缩放
	AnimationTemplateFunction.customTrail_addTrail(Module_default.data["airSlash"],0,0,-1,0,0,-1.75,"Tool_R",0.0,2.7,2.95,255,59,59,12,3,"",true,false)
	//无视闪避
	AnimationTemplateFunction.customDamage_addTagKeyDamageType(Module_default.data["dashAttack"],"epicfight:bypass_dodge")
	//AnimationTemplateFunction.customDamage_addTagKeyDamageType(Module_default.data["dashAttack"],"epicfight:bypasses_invulnerability")
	//无视格挡
	AnimationTemplateFunction.customDamage_addTagKeyDamageType(Module_default.data["airSlash"],"epicfight:guard_puncture")
	AnimationTemplateFunction.customDamage_damage(Module_default.data["airSlash"],null,0,1)//1.0scale,airslash vanilla 1.5 scale
	
	Module_default.data["dashAttack"].onHurtFN.normal.add(
	new Consumer({accept:function(args){
			var template=args[0]
			var entity=args[1]
			var event=args[2]
			var entityTempdata=template.getEntityData(entity)
			var epicAddCap=entity.getCapability(EpicAddCapabilityProvider.EPIC_ADD_CAPABILITY).orElse(null)
			var patch=entity.getCapability(EpicFightCapabilities.CAPABILITY_ENTITY).orElse(null)
			
			epicAddCap.addSimpleState(0,10,"canBasicAttack",true)
			epicAddCap.updataCustomStateSpectrum()
		}})
	)
	
	Module_default.addEvent("loadSelf",function(container){
		container.doRender=true;
		container.isEnable=false;
		container.isDisable=false;
		container.spell_textures="minecraft:textures/item/nether_star.png";
		container.maxCooldow=80;
		container.maxMana=0;
		container.cooldown=Math.min(container.cooldown,container.maxCooldow);
		container.mana=container.maxMana;
		container.needUpdate=true;
		container.text=""
	});
	
	Module_default.addEvent("onExecuteSkill",function(container,event){
		if(event.isCanceled()){return}//如果被取消就不执行，这一般是别的技能已经运行了,比自己优先级高
		var player=container.player
		var patch=player.getCapability(EpicFightCapabilities.CAPABILITY_ENTITY).orElse(null);
		var skillContainer = patch.getSkill(event.event.skillSlot);
		var dataManager = skillContainer.getDataManager();
		var playerState = patch.getEntityState();
		var basicAttackData=patch.getSkill(SkillSlots.BASIC_ATTACK).getDataManager();
		var comboCounter=patch.getSkill(SkillSlots.BASIC_ATTACK).getDataManager().getDataValue(SkillDataKeys.COMBO_COUNTER.get());//普攻段数
		var sprint=player.m_20142_()//疾跑中
		switch(event.event.skillSlot){
			case SkillSlots.AIR_ATTACK.universalOrdinal():
				//跳劈
				event.setCanceled(true)//这一步是让别的技能知道别执行了
				event.event.setCanceled(true)//这一步才是取消ef执行
				if(this.data["airSlash"]==null){break}//没有跳劈
				if(!(player.m_20159_() || player.m_5833_() || patch.isInAir() || !playerState.canBasicAttack())){//从跳劈技能上扣的判定
					var consumeStamina=this.data["airSlashStamina"]
					if(consumeStamina>0){consumeStamina=patch.getModifiedStaminaConsume(consumeStamina)}
					if(consumeStamina>0 && patch.getStamina()<consumeStamina){
						//耐力不足
						break
					}
					patch.setStamina(patch.getStamina()-consumeStamina)
					this.data["airSlash"].play(player)
					basicAttackData.setData(SkillDataKeys.COMBO_COUNTER.get(),Integer.valueOf(comboCounter));
				}
				break
			case SkillSlots.BASIC_ATTACK.universalOrdinal():
				//普攻
				event.setCanceled(true)//这一步是让别的技能知道别执行了
				event.event.setCanceled(true)//这一步才是取消ef执行
				if(player.m_5833_() || patch.isInAir() || !playerState.canBasicAttack()){break}//从普攻上扣的判定
				if(sprint && this.data["dashAttack"]!=null){
					var consumeStamina=this.data["dashAttackStamina"]
					if(consumeStamina>0){consumeStamina=patch.getModifiedStaminaConsume(consumeStamina)}
					if(consumeStamina>0 && patch.getStamina()<consumeStamina){
						//耐力不足
						break
					}
					patch.setStamina(patch.getStamina()-consumeStamina)
					this.data["dashAttack"].play(player)
					basicAttackData.setData(SkillDataKeys.COMBO_COUNTER.get(),Integer.valueOf(0));//清除普攻段数
					break
				}
				if(this.data["basicAttack"].length==0){break}//没有普攻
				if(comboCounter>=this.data["basicAttack"].length || comboCounter<0){comboCounter=0}
				var consumeStamina=this.data["basicAttackStamina"][comboCounter]
				if(consumeStamina>0){consumeStamina=patch.getModifiedStaminaConsume(consumeStamina)}
				if(consumeStamina>0 && patch.getStamina()<consumeStamina){
					//耐力不足
					break
				}
				patch.setStamina(patch.getStamina()-consumeStamina)
				this.data["basicAttack"][comboCounter].play(player)
				basicAttackData.setData(SkillDataKeys.COMBO_COUNTER.get(),Integer.valueOf(comboCounter+1));
				break
			case SkillSlots.DODGE.universalOrdinal():
				//闪避不执行
				break
			case SkillSlots.WEAPON_INNATE.universalOrdinal():
				//武器技能不执行
				break
			
		}
	})
	
	
	//最后记得注册
	regModule(Module_default)
}
function regModule(moduleObj){
	modules.put(moduleObj.id,moduleObj)
}

function regSkillBook(customJsSkill){//技能书 技能工作台配置 random_skill_item skill_workbench
	var RandomSkillBookProbability=1//随机技能书概率 0则抽不出来,右键随机技能书获取的概率,比如三个技能ABC,概率分别是1,2,5,那就是从数组[A,B,B,C,C,C,C,C]里抽1个
	var availableSlot={}
	//All的优先级更高,会覆盖掉别的设置！AllWeapon AllArmor has a higher priority and overwrites other Settings!
	//武器部分 其他附属的理论上也可以,转字符串匹配上就行
	//AllWeapon(只要不是NOT_WEAPON) NOT_WEAPON AXE FIST GREATSWORD HOE PICKAXE SHOVEL SWORD UCHIGATANA SPEAR TACHI TRIDENT LONGSWORD DAGGER SHIELD RANGED
	//盔甲部分,如果物品继承net.minecraft.world.item.ArmorItem,则会先进行此项判断,头颅因为不是继承ArmorItem所以用不了！
	//AllArmor(后面四种) FEET LEGS CHEST HEAD
	availableSlot["AllWeapon"]=[8,9,10,11,12,13,14,15]//在技能工作台中哪些槽位可以镶嵌0-7主动(第一排),8-15被动(第二排)
	//availableSlot["AllArmor"]=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]//像这样换行然后照着写就行了
	
	var displayName='{"italic":false,"extra":[{"color":"#FF4AFF","text":"example_basicAttack"}],"text":""}'
	var lores=[]
	lores[0]='{"italic":false,"extra":[{"color":"#ffffff","text":"可以镶嵌在任何武器的被动槽."}],"text":""}'
	
	var itemDefaultSkill={};
	//itemDefaultSkill["minecraft:golden_sword"]=[0,1]
	
	
	
	var SkillWorkbenchBlockEntity=Java.type("tkk.epic.block.entity.SkillWorkbenchBlockEntity")
	var ArmorItem=Java.type("net.minecraft.world.item.ArmorItem")
	var EquipSkillHandle=Java.type("tkk.epic.skill.EquipSkillHandle")
	var ResourceLocation=Java.type("net.minecraft.resources.ResourceLocation")
	var StringArray=Java.type("java.lang.String[]")
	var SkillId=getSkillId()
	SkillWorkbenchBlockEntity.SKILL_PREDICATE.put(SkillId,
	new Consumer({accept:function(e){
		var slots=null
		var item=e.target.m_41720_()
		var isArmor=item instanceof ArmorItem
		if(isArmor){
			var type=item.m_40402_().name()
			slots=availableSlot["AllArmor"]
			if(slots==null){
				slots=availableSlot[type]
			}
		}else{
			var type=EpicFightCapabilities.getItemStackCapability(e.target).getWeaponCategory().toString()//不用name是因为我不知道附属会不会不用enum,这样不会炸
			if(type!="NOT_WEAPON"){slots=availableSlot["AllWeapon"]}
			if(slots==null){
				slots=availableSlot[type]
			}
		}
		if(slots==null || slots.indexOf(e.slot)==-1){
			//不在可用槽位内
			e.canBeInfusion=false
		}
		}})
	);
	RandomSkillItem.regRandomSkill(SkillId,RandomSkillBookProbability,new Supplier({get:function(e){
		try{
			var ItemStack=Java.type("net.minecraft.world.item.ItemStack")
			var TkkEpicItems=Java.type("tkk.epic.item.TkkEpicItems")
			var SkillWorkbenchBlockEntity=Java.type("tkk.epic.block.entity.SkillWorkbenchBlockEntity")
			var ListTag=Java.type("net.minecraft.nbt.ListTag")
			var StringTag=Java.type("net.minecraft.nbt.StringTag")
			var give=new ItemStack(TkkEpicItems.SKILL_ITEM.get(),1);
			give.m_41784_().m_128359_(SkillWorkbenchBlockEntity.SKILL_BOOK_TAG, SkillId)
			var display = give.m_41698_("display");
			display.m_128359_("Name",displayName)
			var loreNbt=new ListTag()
			for(var x in lores){
				loreNbt.add(StringTag.m_129297_(lores[x]))
			}
			display.m_128365_("Lore",loreNbt);
			return give
		}catch(e){
			Java.type("tkk.epic.TkkEpic").getInstance().broadcast("RandomSkillItem js Supplier Error:"+e)
			return null
		}
	}}))
	
	for(var x in itemDefaultSkill){
		var itemId=new ResourceLocation(x)
		var arr=EquipSkillHandle.itemDefaultSkill.get(itemId)
		if(arr==null){arr=new StringArray(16)}
		var skillSlotArr=itemDefaultSkill[x]
		for(var y in skillSlotArr){
			arr[skillSlotArr[y]]=SkillId
		}
		EquipSkillHandle.itemDefaultSkill.put(itemId,arr)
	}
	


}


function runCommand(entity,command){
	entity.m_20194_().m_129892_().m_230957_(entity.m_20203_().m_81324_().m_81325_(3),command);
}

//tool
function animationTemplateConnect_time(animationTemplate,nextAnimation,time){//时间 time不受到攻速影响
	var LivingEntityPatch=Java.type("yesman.epicfight.world.capabilities.entitypatch.LivingEntityPatch")
	animationTemplate.tickFN.normal.add(
	new Consumer({accept:function(args){
			var template=args[0]
			var entity=args[1]
			var entityTempdata=template.getEntityData(entity)
			var entityPatch = entity.getCapability(EpicFightCapabilities.CAPABILITY_ENTITY).orElse(null);
			if (!(entityPatch instanceof LivingEntityPatch)){
				return;
			}
			var nowAnimationTime=entityPatch.getServerAnimator().getPlayerFor(null).getElapsedTime();
			if(nowAnimationTime>=time){
				nextAnimation.play(entity)
			}
			//TkkEpic.getInstance().broadcast("animationTemplateConnect_time nowAnimationTime "+nowAnimationTime)
		}})
	)
	
}
function animationTemplateConnect_end(animationTemplate,nextAnimation){//结束
	animationTemplate.postEndFN.normal.add(
	new Consumer({accept:function(args){
			var template=args[0]
			var entity=args[1]
			var isBreak=args[2]
			var entityTempdata=template.getEntityData(entity)
			if(!isBreak){
				nextAnimation.play(entity)
			}
		}})
	)
	
}
function animationTemplateConnect_break(animationTemplate,nextAnimation){//被打断
	animationTemplate.postEndFN.normal.add(
	new Consumer({accept:function(args){
			var template=args[0]
			var entity=args[1]
			var isBreak=args[2]
			var entityTempdata=template.getEntityData(entity)
			if(isBreak){
				nextAnimation.play(entity)
			}
		}})
	)
	
}
function animationTemplateConnect_onHurt(animationTemplate,nextAnimation){//造成伤害立刻切换
	animationTemplate.onHurtFN.normal.add(
	new Consumer({accept:function(args){
			var template=args[0]
			var entity=args[1]
			var event=args[2]
			var entityTempdata=template.getEntityData(entity)
			nextAnimation.play(entity)
		}})
	)
}
function animationTemplateConnect_onHurtAndEnd(animationTemplate,nextAnimation){//造成伤害并结束
	animationTemplate.prePlayFN.normal.add(
	new Consumer({accept:function(args){
			var template=args[0]
			var entity=args[1]
			var entityTempdata=template.getEntityData(entity)
			entityTempdata.put("animationTemplateConnect_onHurtAndEnd_hit",false)
		}})
	);
	animationTemplate.onHurtFN.normal.add(
	new Consumer({accept:function(args){
			var template=args[0]
			var entity=args[1]
			var event=args[2]
			var entityTempdata=template.getEntityData(entity)
			entityTempdata.put("animationTemplateConnect_onHurtAndEnd_hit",true)
		}})
	)
	animationTemplate.postEndFN.normal.add(
	new Consumer({accept:function(args){
			var template=args[0]
			var entity=args[1]
			var isBreak=args[2]
			var entityTempdata=template.getEntityData(entity)
			if(!isBreak && entityTempdata.get("animationTemplateConnect_onHurtAndEnd_hit")==true){
				nextAnimation.play(entity)
			}
			entityTempdata.remove("animationTemplateConnect_onHurtAndEnd_hit")
		}})
	)
	
}
function animationTemplateConnect_onHurtAndTime(animationTemplate,nextAnimation,time){//造成伤害且时间 time不受到攻速影响
	var LivingEntityPatch=Java.type("yesman.epicfight.world.capabilities.entitypatch.LivingEntityPatch")
	animationTemplate.prePlayFN.normal.add(
	new Consumer({accept:function(args){
			var template=args[0]
			var entity=args[1]
			var entityTempdata=template.getEntityData(entity)
			entityTempdata.put("animationTemplateConnect_onHurtAndTime_hit",false)
		}})
	);
	animationTemplate.onHurtFN.normal.add(
	new Consumer({accept:function(args){
			var template=args[0]
			var entity=args[1]
			var event=args[2]
			var entityTempdata=template.getEntityData(entity)
			entityTempdata.put("animationTemplateConnect_onHurtAndTime_hit",true)
		}})
	)
	animationTemplate.postEndFN.normal.add(
	new Consumer({accept:function(args){
			var template=args[0]
			var entity=args[1]
			var isBreak=args[2]
			var entityTempdata=template.getEntityData(entity)
			entityTempdata.remove("animationTemplateConnect_onHurtAndTime_hit")
		}})
	)
	animationTemplate.tickFN.normal.add(
	new Consumer({accept:function(args){
			var template=args[0]
			var entity=args[1]
			var entityTempdata=template.getEntityData(entity)
			var entityPatch = entity.getCapability(EpicFightCapabilities.CAPABILITY_ENTITY).orElse(null);
			if (!(entityPatch instanceof LivingEntityPatch)){
				return;
			}
			var nowAnimationTime=entityPatch.getServerAnimator().getPlayerFor(null).getElapsedTime();
			if(entityTempdata.get("animationTemplateConnect_onHurtAndTime_hit")==true && nowAnimationTime>=time){
				nextAnimation.play(entity)
			}
		}})
	)
	
}
function animationTemplateConnect_beAttackAndImmune(animationTemplate,nextAnimation,fn){//被伤害，取消伤害立刻切换
	var sound=Java.type("yesman.epicfight.gameasset.EpicFightSounds")
	animationTemplate.beAttackFN.normal.add(
	new Consumer({accept:function(args){
			var template=args[0]
			var entity=args[1]
			var event=args[2]
			var entityTempdata=template.getEntityData(entity)
			event.setCanceled(true)
			runCommand(entity,"playsound epicfight:entity.hit.clash master @a[distance=..50] ~ ~ ~ 10 1.5 1")
			runCommand(entity,"particle epicfight:hit_blunt ^ ^1 ^1 0.2 0.2 0.2 1 4")
			nextAnimation.play(entity)
		}})
	)
}


function ironMagicManaTool(){
	var self=this
	this.enable=false
	try{
		this.MagicData=Java.type("io.redspace.ironsspellbooks.api.magic.MagicData")
		this.enable=true
	}catch(e){}
	
	this.getMana=function(player){
		if(!self.enable){return 0}
		return self.MagicData.getPlayerMagicData(player).getMana()
	}
	this.setMana=function(player,mana){
		if(!self.enable){return}
		self.MagicData.getPlayerMagicData(player).setMana(mana)
	}
	this.addMana=function(player,mana){
		if(!self.enable){return}
		self.MagicData.getPlayerMagicData(player).addMana(mana)
	}
	this.checkMana=function(player,mana){
		if(!self.enable){return true}
		return self.MagicData.getPlayerMagicData(player).getMana()>=mana
	}

	
	
}
var ironMagicMana=new ironMagicManaTool()







//根据id获取tempdata
function getTempdataForId(container,id){
	if(!container.tempdata.containsKey(id)){
		container.tempdata.put(id,new HashMap())
	}
	return container.tempdata.get(id)
}
//清除tempdata
function clearTempdata(container){
	container.tempdata.remove(getSkillId())
}
//获取tempdata tempdata死亡,退出重进不会保存
function getTempdata(container){
	var id=getSkillId()
	if(!container.tempdata.containsKey(id)){
		container.tempdata.put(id,new HashMap())
	}
	return container.tempdata.get(id)
}
//获取当前模块,如果无模块则会切换到defaultModule,并触发load()
function getNowModule(container){
	var data=getTempdata(container)
	if(!data.containsKey("module") || !modules.containsKey(data.get("module"))){
		data.put("module",defaultModule)
		getNowModule(container).load(container)
	}
	var modelId=data.get("module")
	return modules.get(modelId);
}
//切换模块 先运行当前模块的unload(),然后再切换 运行新模块的load()
function switchModule(container,moduleId){
	var data=getTempdata(container)
	getNowModule(container).unload(container)
	data.put("module",moduleId)
	getNowModule(container).load(container)
}





function loadSelf(container){getNowModule(container).runEvent("loadSelf",[container])}
function unloadSelf(container){getNowModule(container).runEvent("unloadSelf",[container])}
function tick(container){getNowModule(container).runEvent("tick",[container])}
function pressKeySelf(container,event){getNowModule(container).runEvent("pressKeySelf",[container,event])}
function upKeySelf(container,event){getNowModule(container).runEvent("upKeySelf",[container,event])}
function beAttack(container,event){getNowModule(container).runEvent("beAttack",[container,event])}
function onAttack(container,event){getNowModule(container).runEvent("onAttack",[container,event])}
function beHurt(container,event){getNowModule(container).runEvent("beHurt",[container,event])}
function onHurt(container,event){getNowModule(container).runEvent("onHurt",[container,event])}
function onExecuteSkill(container,event){getNowModule(container).runEvent("onExecuteSkill",[container,event])}
function beDeath(container,event){getNowModule(container).runEvent("beDeath",[container,event])}
function onDeath(container,event){getNowModule(container).runEvent("onDeath",[container,event])}
//这个要在init里加,直接copy没用 
function onExecuteSkillHighPriority(container,event){getNowModule(container).runEvent("onExecuteSkillHighPriority",[container,event])}



function SkillModule(id){
	this.id=id;
	this.data={}
	this.subscribeEvent={}
	this.runEvent=function(fn,args){
		if(this.subscribeEvent[fn]==null){return}
		this.subscribeEvent[fn].apply(this,args)
	}
	this.addEvent=function(fnName,fn){
		this.subscribeEvent[fnName]=fn
	}
	this.load=function(container){
		
	}
	this.unload=function(container){
		
	}
	
	
	
}








