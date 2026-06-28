package com.estate;

import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class RealEstateManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(RealEstateManagementApplication.class, args);
	}

	@Bean // method level annotation - to declare a method returning java object
	ModelMapper modelMapper() {
		ModelMapper mapper = new ModelMapper();
		// configure mapper - to transfer the matching props (name + data type)
		mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT)
				// configure mapper - not to transfer nulls from src -> dest
				.setPropertyCondition(Conditions.isNotNull());
		return mapper;// Method rets configured ModelMapper bean to SC
	}
}
